#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-FINDINGS-BATCH · SLICE 2 · B (the mothership's 11:06; ADR 0031 §9.40–§9.44, ratified at claims §350, §356, §358): THE CHILD'S
// LOOPS, read by `childLoopsOf` (src/lib/childLoops.ts). §1 on Virgin Land's `Culture` (19:34): the pairs of roles by kind, against the mothership's re-run
// (claims §350, amended by §9.44: 39 fillable, 17 only across a refusal, 3 two words at one pair, of 153) and the researcher's open pairs (55), each
// also counted HERE from the parents' casts by a reading of its own, never from the reader under test (agreement is not correctness) · §2 the loops: 136
// closed (71 askable, 62 across a refusal, 3 two words at one pair), a side with two words making two loops · §3 the diagonals of a four-sided loop and of
// a three-sided one (the relating itself) · §4 on F–Φ 17:59: its 3 closed loops all across a refusal, nothing fillable, and Φ's `joins` (three places)
// counted apart, never a loop · §0 the reader reads only, through the child's own reader.
// Run: node scripts/diagnose-the-childs-loops.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { childLoopsOf, diagonalsOf } = req('src/lib/childLoops.ts');
const { relatingsHeld, dirOf } = req('src/lib/relatings.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};

const FIX = path.join(repoRoot, 'scripts/fixtures/altitude');
const open = (file, a, b) => {
  const ws = JSON.parse(fs.readFileSync(path.join(FIX, file), 'utf8'));
  const shape = ws.shapes[ws.currentShapeId];
  const cornerOf = (lab) => Object.values(shape.vertices).find((v) => v.data?.label === lab && v.data?.cast)?.id;
  const A = cornerOf(a); const B = cornerOf(b);
  const mid = Object.values(shape.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(A) && v.createdBy.sourceVertexIds.includes(B));
  const edge = shape.edges.find((e) => e.vertexIds.includes(A) && e.vertexIds.includes(B));
  return { shape, siteId: mid.id, edge, L: childLoopsOf(shape, mid.id) };
};

// AN INDEPENDENT READING, from the edge's packet and the two seed casts as the file holds them (never the reader's roles, says or loops)
const independent = (o) => {
  const [X, Y] = o.edge.vertexIds;
  const CX = o.shape.vertices[X].data.cast; const CY = o.shape.vertices[Y].data.cast;
  const roles = relatingsHeld(o.edge).filter((r) => r[3] === '+').map((r) => ({ x: r[1], y: r[2] }));
  const says = (C, p, q) => {
    if (p === q) return ['='];
    const seen = new Set();
    for (const r of C.relations || []) {
      if ((r.terms || []).length !== 2) continue;
      const f = r.terms[0] === p && r.terms[1] === q; const b = r.terms[0] === q && r.terms[1] === p;
      if (f || b) seen.add(`${r.polarity === 'does-not-hold' ? '-' : '+'}${r.type}${f ? '>' : '<'}`);
    }
    return [...seen];
  };
  const out = { fillable: 0, refusalOnly: 0, twoWords: 0, open: 0, sameAndSilent: 0, nothing: 0, loops: 0, askable: 0, form: 0, two: 0 };
  for (let i = 0; i < roles.length; i += 1) for (let j = i + 1; j < roles.length; j += 1) {
    const xs = says(CX, roles[i].x, roles[j].x); const ys = says(CY, roles[i].y, roles[j].y);
    if (!xs.length && !ys.length) { out.nothing += 1; continue; }
    if (!xs.length || !ys.length) { if ([...xs, ...ys].some((s) => s !== '=')) out.open += 1; else out.sameAndSilent += 1; continue; }
    const two = xs[0] === '=' && ys[0] === '=';
    let ask = 0;
    for (const sx of xs) for (const sy of ys) {
      out.loops += 1;
      const refused = sx.startsWith('-') || sy.startsWith('-');
      if (two) out.two += 1; else if (refused) out.form += 1; else { out.askable += 1; ask += 1; }
    }
    if (two) out.twoWords += 1; else if (ask) out.fillable += 1; else out.refusalOnly += 1;
  }
  return out;
};

// ═══ §1 · §2 CULTURE ═══
console.log('\n----- §1 · §2 Culture -----');
const c = open('virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json', 'Value', 'Fact');
const ci = independent(c);
const cp = c.L ? c.L.pairs : {};
check('§1 ★★ THE PAIRS OF CULTURE\'S ROLES, BY KIND (claims §350 as amended by §9.44 — the mothership\'s re-run: 39 fillable, 17 only across a refusal, 3 two words at one pair, of 153): the reader, and a reading of its own from the edge\'s packet and the casts, agree, and both agree with the re-run',
  !!c.L && c.L.roles.length === 18 && cp.total === 153 && cp.fillable === 39 && cp.refusalOnly === 17 && cp.twoWords === 3 && ci.fillable === 39 && ci.refusalOnly === 17 && ci.twoWords === 3,
  { reader: cp, independent: ci });
check('§1 ★★ THE PAIRS NEVER SHOWN (§9.40: an open loop is nothing, never shown): 94 — 55 where one parent RELATES its two ends and the other is silent between two different roles (the researcher\'s OPEN, its recheck at 81ad233), 16 where one parent\'s ends are the same role and the other is silent, 23 where both are silent; the mock\'s 71 open are the first two together',
  cp.open === 55 && cp.sameAndSilent === 16 && cp.nothing === 23 && ci.open === 55 && ci.sameAndSilent === 16 && ci.nothing === 23 && cp.open + cp.sameAndSilent + cp.nothing + cp.fillable + cp.refusalOnly + cp.twoWords === 153,
  { reader: { open: cp.open, sameAndSilent: cp.sameAndSilent, nothing: cp.nothing }, independent: { open: ci.open, sameAndSilent: ci.sameAndSilent, nothing: ci.nothing } });
const kinds = (L) => L.loops.reduce((m, l) => { const k = l.kind === 'two' ? 'two' : l.form ? 'form' : 'askable'; m[k] = (m[k] || 0) + 1; return m; }, {});
const ck = c.L ? kinds(c.L) : {};
check('§2 ★★ THE LOOPS (§9.40: one per pair of says — a side holding two words makes two): 136 closed — 71 that can be asked, 62 across a refusal (form), 3 two words at one pair — the reader and the reading of its own agree (the designer\'s head on Culture, `loops: 71 waiting … 62 across a refusal · two words at one pair: 3`)',
  !!c.L && c.L.loops.length === 136 && ck.askable === 71 && ck.form === 62 && ck.two === 3 && ci.loops === 136 && ci.askable === 71 && ci.form === 62 && ci.two === 3,
  { reader: ck, independent: { loops: ci.loops, askable: ci.askable, form: ci.form, two: ci.two } });
check('§2 ★ EVERY LOOP\'S KIND IS ITS SIDES\': four sides where both parents relate two different roles; three where one parent\'s ends are one role (`shared` names it); two where both are (never form, never asked); form exactly where a side does not hold',
  !!c.L && c.L.loops.every((l) => (l.kind === 'four') === (!l.X.same && !l.Y.same) && (l.kind === 'two') === (l.X.same && l.Y.same) && (l.kind === 'three') === (l.X.same !== l.Y.same) && (l.shared === (l.kind === 'three' ? (l.X.same ? 'X' : 'Y') : null)) && l.form === ((!l.X.same && !l.X.holds) || (!l.Y.same && !l.Y.holds))));

// ═══ §3 THE DIAGONALS ═══
console.log('\n----- §3 the diagonals -----');
const four = c.L && c.L.loops.find((l) => l.kind === 'four' && !l.form);
const d4 = four ? diagonalsOf(c.L, four) : [];
const ri = four && c.L.roles[four.i]; const rj = four && c.L.roles[four.j];
check('§3 ★★ A FOUR-SIDED LOOP ASKS BOTH DIAGONALS (§9.42), i\'s first: from i\'s Value end to j\'s Fact end, and from j\'s Value end to i\'s Fact end — each with two ways round, by Value\'s side (Value\'s say, then the other relating) and by Fact\'s side (the relating, then Fact\'s say); neither way is a relating itself',
  !!four && d4.length === 2 && d4[0].from === 'i' && d4[0].start === ri.x && d4[0].end === rj.y && d4[1].from === 'j' && d4[1].start === rj.x && d4[1].end === ri.y &&
    J(d4[0].a.legs.map((g) => g.kind)) === J(['say', 'relating']) && d4[0].a.legs[1].role === four.j && J(d4[0].b.legs.map((g) => g.kind)) === J(['relating', 'say']) && d4[0].b.legs[0].role === four.i &&
    d4[1].a.legs[1].role === four.i && d4[1].b.legs[0].role === four.j && d4.every((d) => !d.a.itself && !d.b.itself),
  { loop: four && { i: ri.key, j: rj.key }, diagonals: d4.map((d) => ({ from: d.from, start: d.start, end: d.end })) });
const three = c.L && c.L.loops.find((l) => l.kind === 'three' && !l.form && l.shared === 'X');
const d3 = three ? diagonalsOf(c.L, three) : [];
check('§3 ★★ A THREE-SIDED LOOP: on each diagonal one way IS the relating itself (no field — the designer\'s 11:17 §3) — with Value\'s ends one role, the way by Value\'s side is the other relating alone',
  !!three && d3.length === 2 && d3.every((d) => d.a.itself && d.a.legs.length === 1 && d.a.legs[0].kind === 'relating' && !d.b.itself && d.b.legs.length === 2) && d3[0].a.legs[0].role === three.j && d3[1].a.legs[0].role === three.i,
  three && { i: c.L.roles[three.i].key, j: c.L.roles[three.j].key });
const twoL = c.L && c.L.loops.find((l) => l.kind === 'two');
check('§3 ★ TWO WORDS AT ONE PAIR ARE NEVER ASKED (§9.44 (3)): no diagonal', !!twoL && diagonalsOf(c.L, twoL).length === 0);

// ═══ §4 F–Φ 17:59 ═══
console.log('\n----- §4 F–Φ 17:59 -----');
const fFile = fs.readdirSync(FIX).find((f) => /_1759_/.test(f));
const f = open(fFile, 'F', 'Φ');
const fi = independent(f);
check('§4 ★★ ON F–Φ 17:59 EVERY CLOSED LOOP CROSSES A REFUSAL (the mothership\'s ruling of the edge cases, claims §358): its 3 closed loops are form, nothing is fillable — the reader and the reading of its own agree',
  !!f.L && f.L.loops.length === 3 && f.L.loops.every((l) => l.form) && f.L.pairs.fillable === 0 && f.L.pairs.refusalOnly === 3 && fi.loops === 3 && fi.form === 3 && fi.fillable === 0,
  { reader: f.L && f.L.pairs, independent: fi });
check('§4 ★★ A RELATION OF THREE PLACES MAKES NO LOOP (§9.44 scope): Φ\'s `joins` among the child\'s ends is counted apart, READ, never a loop',
  !!f.L && f.L.many.length === 1 && f.L.many[0].side === 'Y' && f.L.many[0].w === 'joins' && f.L.many[0].terms.length === 3,
  f.L && f.L.many);

// ═══ §0 PURITY ═══
const src = fs.readFileSync(path.join(repoRoot, 'src/lib/childLoops.ts'), 'utf8');
check('§0 ★ THE READER READS ONLY: React-free, DOM-free, no store; the child\'s own roles through the instance space (`instanceSpaceOf` — never the child read as a parent, so no recursion), its parents through the child\'s own reader (`childSpaceOf`, with his records: a born parent\'s say is its filled loops, slice 2 · F), the ends through the coordinate map (`instancesFrom`) — never a key parsed, never a cast read off a vertex',
  !/from 'react'|document\.|window\.|geometryStore/.test(src) && /instanceSpaceOf\(shape, e, options\)\?\.space/.test(src) && /childSpaceOf\(shape, X, options\)/.test(src) && /childSpaceOf\(shape, Y, options\)/.test(src) && /instancesFrom\(shape, X, Y, options\)/.test(src) && !/\.cast\b/.test(src) && !/\.split\(/.test(src));

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-CHILDS-LOOPS: ALL PASS — Culture\'s 153 pairs by kind (39 fillable, 17 across a refusal only, 3 two words at one pair; 55 open, 16 same and silent, 23 nothing) and its 136 loops (71 askable, 62 form, 3 two words), agreed by a reading of its own; both diagonals with their ways; F–Φ 17:59 all form, its three-place joins counted apart');
else { console.log(`DIAGNOSE-THE-CHILDS-LOOPS: ${failures} FAIL`); process.exitCode = 1; }

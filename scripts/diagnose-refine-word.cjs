#!/usr/bin/env node

// DIAGNOSTIC — REFINE'S WORD: the resolution is NAMED ('refine' on the frozen
// OperationKind), its record RIDES the form (`genealogy.resolution`, a
// ResolutionTrace — no call site can drop it), the genealogy DAG mints NO
// birth node/edge for it, and the specimen READS it.
//
// THE TEETH (this witness BITES — a planted birth-node for a resolution, a
// planted χ-move, or a dropped reader flips it RED):
//   §1 ★ BOTH routes (refineToDisk — the word pair; refineAcquiredToDisk —
//      the wordless pair) stamp word='refine' + typeClaim='resolution', the
//      riding trace IS the returned record (reference-equal), χ CANNOT move
//      (measured V−E+F before/after), and the stamp's delta is EXACTLY
//      {operation, resolution} — parent pointer, depth, source/created ids,
//      createdAt byte-carried;
//   §2 ★ NON-BEGETTING: the DAG over [parent, born, refined] is key-equal to
//      the DAG over [parent, born] (nodes · edges · record · live · path) —
//      the re-expression adds NOTHING, no duplicate-id throw (refine keeps
//      the id: the form's ONE node is its original expression's), the born
//      form STAYS LIVE (nothing consumed), and NO 'refine' operation appears
//      anywhere in nodes/edges/record;
//   §3 the MANUSCRIPT seam, whole: birthChild on two route-refined tori
//      lands (child 'assemble', parentShape null, BOTH stamped parents
//      carried), the frozen story collector keeps EXACTLY ONE copy of each
//      page form — the UNSTAMPED original (word 'glue', first-wins) — and
//      readGenesis draws glue/assemble edges only, never a refine;
//   §4 the equalize COMPOSE: a stamped minted disk split against a REAL
//      pass-through port (the thicken band's 4-gon) re-stamps a COMPOSED
//      trace — passes prior+1, chord kept, carrier landing EVERY grown cell
//      on the person's ORIGINAL cells (composition of surjections, nothing
//      invented);
//   §5 births unchanged (low-ripple): the store combine still lands children
//      with BIRTH words ('assemble'), and a born-only population's DAG still
//      carries the birth ops — the walk moved for resolutions ONLY;
//   §6 the wires, grepped on the working bytes (types root · DAG · stamps ·
//      the view's resolution row — a RESOLUTION, never drawn as a birth);
//   §7 the two re-seals READ: manifest :87/:49 rows === sha256 of the
//      CR-stripped working bytes of geometry.ts / genealogyDag.ts.
//
// DISCLOSED (measured, PRE-EXISTING — byte-forced at HEAD, not moved here):
// a connect-sum child of route-refined operands can cite refine-minted rim
// corners (mid:…) in its vertex lineage; the story rightly records the
// UNSTAMPED originals as parents, so readGenesis surfaces ghost-source
// violations for those minted ids. connectedSum reads NO genealogy and the
// stamp's delta is exactly {operation, resolution}, so the child's bytes are
// HEAD's bytes — §3 tolerates exactly that violation class and nothing else.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { thicken } = req('src/lib/thicken.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const { recoverBornSurface } = req('src/playground/bornFormRouting.ts');
const { refineToDisk, refineAcquiredToDisk, equalizePreparedDisks } = req('src/lib/surfaceRefinement.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { birthChild, genesisStoryShapes, readGenesis } = req('src/manuscript/genesisModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
let seq = 700;

const chi = (s) => Object.keys(s.vertices).length - s.edges.length + s.faces.length;
const dagKey = (d) =>
  JSON.stringify({
    nodes: d.nodes.map((n) => `${n.id}:${n.birthOperation}`).sort(),
    edges: d.edges.map((e) => `${e.parent}->${e.child}:${e.operation}:${e.consuming}`).sort(),
    record: d.record.map((r) => `${r.kind}:${r.node}:${r.operation}`),
    live: [...d.unconsumedAtEnd].sort(),
    pop: d.unconsumedPath,
  });
const noRefineAnywhere = (d) =>
  !d.nodes.some((n) => n.birthOperation === 'refine') &&
  !d.edges.some((e) => e.operation === 'refine') &&
  !d.record.some((r) => r.operation === 'refine');
const stampDeltaExact = (refinedShape, bornShape) => {
  const g = { ...refinedShape.genealogy };
  delete g.resolution;
  g.operation = bornShape.genealogy.operation;
  return JSON.stringify(g) === JSON.stringify(bornShape.genealogy);
};

console.log("REFINE'S WORD: the resolution named, carried on the form, non-begetting, read\n");

const G = () => usePlaygroundStore.getState();
G().resetPlayground();

// ---------------------------------------------------------------------------
// §1 ★ BOTH ROUTES stamp — word='refine' · trace rides · χ cannot move
// ---------------------------------------------------------------------------
console.log("----- §1 ★ both routes: the stamp, the ride, χ fixed -----");

// the WORD route: the committed glue-torus door, then the word pair
const hostT = loadForm(nGon(4), 'rwT');
const bornT = applyPlaygroundOperationTo('glue-torus', hostT, null, (seq += 1), 24, [], null);
check('§1 the committed word door births the torus', bornT.ok === true);
const refinedT = refineToDisk(bornT.born.shape, hostT);
note(`word route: χ ${chi(bornT.born.shape)}→${chi(refinedT.shape)} · passes ${refinedT.refinement.passes} · V${Object.keys(refinedT.shape.vertices).length} E${refinedT.shape.edges.length} F${refinedT.shape.faces.length}`);
check("★ §1 WORD ROUTE: genealogy word 'refine' · typeClaim 'resolution' · chord present (measured passes 2)",
  refinedT.shape.genealogy.operation === 'refine' &&
    refinedT.shape.genealogy.resolution?.typeClaim === 'resolution' &&
    refinedT.refinement.passes === 2 &&
    refinedT.shape.genealogy.resolution?.chordEdgeId !== null);
check('★ §1 WORD ROUTE: the riding trace IS the returned record (reference-equal — one record, two hands)',
  refinedT.shape.genealogy.resolution === refinedT.refinement);
check('★ §1 WORD ROUTE: χ CANNOT MOVE (measured V−E+F, 0→0)',
  chi(bornT.born.shape) === 0 && chi(refinedT.shape) === 0);
check('§1 WORD ROUTE: the stamp delta is EXACTLY {operation, resolution} — id, name, everything else byte-carried',
  refinedT.shape.id === bornT.born.shape.id &&
    refinedT.shape.name === bornT.born.shape.name &&
    stampDeltaExact(refinedT.shape, bornT.born.shape));

// the WORDLESS route: the person's lift-built torus, loaded (the REFACQ flow)
const ring = loadForm(() => ({
  name: 'ring',
  vertices: [
    { id: 'r0', position: [1.5, 0, 0] },
    { id: 'r1', position: [-0.75, 1.3, 0] },
    { id: 'r2', position: [-0.75, -1.3, 0] },
  ],
  edges: [
    { vertexIds: ['r0', 'r1'] },
    { vertexIds: ['r1', 'r2'] },
    { vertexIds: ['r2', 'r0'] },
  ],
}));
const band = thicken(ring).shape;
const sewn = applyPlaygroundOperationTo('sew-boundary-preserving', band, null, (seq += 1), 24, [ring]);
check('§1 the lift chain births the wordless torus (unrecoverable — the wordless case is real)',
  sewn.ok === true && recoverBornSurface(sewn.born.shape, band) === null);
const file = serializeSnapshot(sewn.born.shape, 'lift', [band, ring]);
const loaded = G().loadSnapshot(file, 'rwsrc');
const carried = G().loadedAncestors[loaded.id] ?? [];
const refinedA = refineAcquiredToDisk(loaded, carried.length > 0 ? carried : null);
note(`wordless route: χ ${chi(loaded)}→${chi(refinedA.shape)} · passes ${refinedA.refinement.passes}`);
check("★ §1 WORDLESS ROUTE: genealogy word 'refine' · typeClaim 'resolution' · the trace rides reference-equal",
  refinedA.shape.genealogy.operation === 'refine' &&
    refinedA.shape.genealogy.resolution?.typeClaim === 'resolution' &&
    refinedA.shape.genealogy.resolution === refinedA.refinement &&
    refinedA.refinement.passes === 1);
check('★ §1 WORDLESS ROUTE: χ CANNOT MOVE (measured, 0→0) · stamp delta exactly {operation, resolution}',
  chi(loaded) === 0 && chi(refinedA.shape) === 0 && stampDeltaExact(refinedA.shape, loaded));

// ---------------------------------------------------------------------------
// §2 ★ NON-BEGETTING: the DAG is invariant under the re-expression
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★ the non-begetting walk: no node, no edge, nothing consumed -----');
let dag0 = null;
let dag1 = null;
let dagThrew = null;
try {
  dag0 = buildGenealogyDag([hostT, bornT.born.shape]);
  dag1 = buildGenealogyDag([hostT, bornT.born.shape, refinedT.shape]);
} catch (e) {
  dagThrew = e.message;
}
note(dagThrew
  ? `the walk THREW: ${dagThrew}`
  : `dag[parent,born]: ${dag0.nodes.length} nodes · ${dag0.edges.length} edge · ${dag0.record.length} events — dag[+refined]: ${dag1.nodes.length} nodes · ${dag1.edges.length} edge`);
check('★ §2 the DAG over [parent, born, refined] === the DAG over [parent, born] (nodes·edges·record·live·path key-equal; NO duplicate-id throw — the re-expression is not a second citizen)',
  dagThrew === null && dagKey(dag0) === dagKey(dag1) && dag0.nodes.length === 2 && dag0.edges.length === 1);
check("★ §2 NO 'refine' anywhere in the record (nodes · edges · events) — the resolution begets nothing",
  dagThrew === null && noRefineAnywhere(dag1));
check('§2 NOTHING CONSUMED: the born form (the refine\'s own parent expression) STAYS LIVE',
  dagThrew === null && dag1.unconsumedAtEnd.includes(bornT.born.shape.id));
let dagA1ok = false;
try {
  const dagA0 = buildGenealogyDag([loaded]);
  const dagA1 = buildGenealogyDag([loaded, refinedA.shape]);
  dagA1ok = dagKey(dagA0) === dagKey(dagA1) && dagA1.nodes.length === 1 && noRefineAnywhere(dagA1);
} catch {
  dagA1ok = false;
}
check('§2 the wordless route obeys the same law ([loaded] ⊕ its refined expression → ONE node, key-equal)', dagA1ok);

// ---------------------------------------------------------------------------
// §3 the MANUSCRIPT seam: birthChild of refined operands + the story
// ---------------------------------------------------------------------------
console.log('\n----- §3 the manuscript: the birth lands, the story keeps the originals, no refine drawn -----');
const host2 = loadForm(nGon(4), 'rwT2');
const born2 = applyPlaygroundOperationTo('glue-torus', host2, null, (seq += 1), 24, [], null);
const refined2 = refineToDisk(born2.born.shape, host2);
const diskT = refinedT.shape.faces.find((f) => f.id.endsWith(':disk')) ?? null;
const disk2 = refined2.shape.faces.find((f) => f.id.endsWith(':disk')) ?? null;
const birth = birthChild(refinedT.shape, refined2.shape, (seq += 1), diskT, disk2, 24);
check("§3 birthChild on two ROUTE-REFINED tori LANDS (child word 'assemble' — a birth, never 'refine')",
  birth.ok === true && birth.born.shape.genealogy.operation === 'assemble');
check('§3 the child carries BOTH stamped parents (parentShape null — the committed assemble semantics)',
  birth.ok === true &&
    birth.born.parentShape === null &&
    (birth.born.parentShapes ?? []).length === 2 &&
    (birth.born.parentShapes ?? []).every((p) => p.genealogy.operation === 'refine'));
if (birth.ok) {
  const written = [
    { form: { shape: bornT.born.shape, parentShape: hostT } },
    { form: { shape: born2.born.shape, parentShape: host2 } },
    { form: birth.born },
  ];
  const story = genesisStoryShapes(written);
  const xCopies = story.filter((s) => s.id === bornT.born.shape.id);
  note(`story: ${story.length} shapes · X copies ${xCopies.length} · X word '${xCopies[0]?.genealogy.operation}'`);
  check("§3 the story keeps EXACTLY ONE copy of the page form — the UNSTAMPED ORIGINAL (word 'glue'; first-wins + has-check)",
    story.length === 5 && xCopies.length === 1 && xCopies[0].genealogy.operation === 'glue');
  const g = readGenesis(story);
  const edgeOps = g.reducedEdges.map((e) => e.operation).sort().join(',');
  note(`reduced edges [${g.reducedEdges.length}]: ops ${edgeOps} · integrity accepted=${g.accepted} (${g.violations.length} violations)`);
  check("§3 the stemma draws glue/assemble ONLY — the resolution contributes NO node and NO edge",
    g.reducedEdges.length === 4 && edgeOps === 'assemble,assemble,glue,glue' && noRefineAnywhere(g.dag));
  check('§3 both consumed tori are pentimento (the assemble consumes); the walk stays acyclic',
    g.pentimentoIds.has(bornT.born.shape.id) && g.pentimentoIds.has(born2.born.shape.id) && g.dag.integrity.acyclic === true);
  check('§3 integrity violations (if any) are EXACTLY the disclosed pre-existing class — ghost-source citations of refine-minted mid corners, byte-forced at HEAD (connectedSum reads no genealogy; the stamp delta is {operation, resolution} only)',
    g.violations.every((v) => v.includes('ghost source') && v.includes('mid:')));
}

// ---------------------------------------------------------------------------
// §4 the equalize COMPOSE: a real pass-through pair, the trace stays whole
// ---------------------------------------------------------------------------
console.log('\n----- §4 the equalize compose: split once more, still ONE honest trace -----');
const eq = equalizePreparedDisks(
  { shape: refinedT.shape, disk: diskT },
  { shape: band, disk: null },
);
check("§4 the REAL unequal pair equalizes (minted rim 3 vs the band's pass-through 4-gon port)", eq.equalized === 'a');
if (eq.equalized === 'a') {
  const res = eq.a.shape.genealogy.resolution;
  const originalCells = new Set([
    ...Object.keys(bornT.born.shape.vertices),
    ...bornT.born.shape.edges.map((e) => e.id),
    ...bornT.born.shape.faces.map((f) => f.id),
  ]);
  const grownCells = [
    ...Object.keys(eq.a.shape.vertices),
    ...eq.a.shape.edges.map((e) => e.id),
    ...eq.a.shape.faces.map((f) => f.id),
  ];
  note(`grown: passes ${res?.passes} · chord ${res?.chordEdgeId ? 'kept' : 'null'} · carrier ${Object.keys(res?.carrier ?? {}).length} entries · rim ${eq.a.disk?.vertexIds.length}`);
  check("§4 the re-stamp COMPOSES: word 'refine' · passes prior+1 (2+1=3) · the chord edge kept (it exists on the shape)",
    eq.a.shape.genealogy.operation === 'refine' &&
      res?.typeClaim === 'resolution' &&
      res?.passes === 3 &&
      res?.chordEdgeId !== null &&
      eq.a.shape.edges.some((e) => e.id === res?.chordEdgeId));
  check('§4 the composed carrier is TOTAL on the grown cells and lands EVERY value on the person\'s ORIGINAL cells (composition of surjections — nothing invented)',
    grownCells.every((id) => res?.carrier[id] !== undefined) &&
      Object.values(res?.carrier ?? {}).every((v) => originalCells.has(v)));
  check('§4 χ still cannot move across the split (measured) · the grown rim equals the port (4)',
    chi(eq.a.shape) === 0 && eq.a.disk?.vertexIds.length === 4);
}

// ---------------------------------------------------------------------------
// §5 births unchanged (low-ripple): the store still speaks birth words
// ---------------------------------------------------------------------------
console.log('\n----- §5 births unchanged: the walk moved for resolutions ONLY -----');
G().resetPlayground();
const hA = loadForm(nGon(4), 'rwA');
const bA = applyPlaygroundOperationTo('glue-torus', hA, null, (seq += 1), 24, [], null);
const hB = loadForm(nGon(4), 'rwB');
const bB = applyPlaygroundOperationTo('flip-glue-mobius', hB, null, (seq += 1), 24, [], null);
G().addForm(hA, { source: 'rwA', origin: 'invoked' });
G().addForm(bA.born.shape, { source: 'rwA', origin: 'born' });
G().addForm(hB, { source: 'rwB', origin: 'invoked' });
G().addForm(bB.born.shape, { source: 'rwB', origin: 'born' });
G().selectForm(bA.born.shape.id);
let storeChild = null;
try {
  storeChild = G().applyCombineToSelection(bB.born.shape.id);
} catch (e) {
  note(`store combine THREW: ${String(e.message).slice(0, 160)}`);
}
check("§5 the store combine still LANDS a child with a BIRTH word ('assemble', χ −2 measured — the sum's own arithmetic)",
  storeChild !== null && storeChild.genealogy.operation === 'assemble' && chi(storeChild) === -2);
const storeDag = buildGenealogyDag(Object.values(G().forms).map((f) => f.shape));
check("§5 the store DAG carries NO 'refine' (the transients were resolutions, never citizens) and the birth edges keep their own words",
  noRefineAnywhere(storeDag) && storeDag.edges.some((e) => e.operation === 'glue'));
check('§5 a born-only population is untouched: [host, born] still walks to 2 nodes · 1 glue edge · death marked',
  dag0 !== null && dag0.edges[0].operation === 'glue' && dag0.edges[0].consuming === true);

// ---------------------------------------------------------------------------
// §6 the wires, grepped on the working bytes
// ---------------------------------------------------------------------------
console.log('\n----- §6 the wires: types root · DAG · stamps · the reader -----');
const geoSrc = fs.readFileSync(path.join(repoRoot, 'src/types/geometry.ts'), 'utf8');
const dagSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/genealogyDag.ts'), 'utf8');
const refSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/surfaceRefinement.ts'), 'utf8');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check("§6 geometry.ts NAMES the word and OWNS the trace: | 'refine' on OperationKind · ResolutionTrace · resolution?: on ShapeGenealogy",
  geoSrc.includes("| 'refine';") &&
    geoSrc.includes('export interface ResolutionTrace') &&
    geoSrc.includes("typeClaim: 'resolution'") &&
    geoSrc.includes('resolution?: ResolutionTrace'));
check('§6 geometry.ts imports NOTHING from surfaceRefinement (the trace lives at the types root — no cycle)',
  !/from '.*surfaceRefinement'/.test(geoSrc) && !/import /.test(geoSrc));
check("§6 genealogyDag.ts: RESOLUTION_KINDS = {'refine'} · 'refine' in NON_CONSUMING · the citizens filter feeds the whole walk",
  /RESOLUTION_KINDS: ReadonlySet<OperationKind> = new Set<OperationKind>\(\['refine'\]\)/.test(dagSrc) &&
    /NON_CONSUMING: ReadonlySet<OperationKind> = new Set<OperationKind>\(\[[^\]]*'refine'\]\)/.test(dagSrc) &&
    dagSrc.includes('shapes.filter((shape) => !RESOLUTION_KINDS.has(shape.genealogy.operation))') &&
    dagSrc.includes('citizens.map'));
check('§6 surfaceRefinement: RefinementRecord ALIGNS to the frozen trace, and BOTH routes stamp the shape',
  refSrc.includes('export type RefinementRecord = ResolutionTrace') &&
    (refSrc.match(/stampResolution\(out\.shape, out\.refinement\)/g) ?? []).length === 2 &&
    refSrc.includes("genealogy: { ...shape.genealogy, operation: 'refine', resolution: refinement }"));
check('§6 the equalize compose chains the carriers (prior ∘ step — every grown cell to an original cell)',
  refSrc.includes('prior.carrier[oldId] ?? oldId') && refSrc.includes('passes: prior.passes + grown.refinement.passes'));
check("§6 the READER: the specimen reads `genealogy.resolution` and speaks a 'resolution' row ('refined · <passes> …') — a resolution, NEVER a birth line",
  viewSrc.includes('parent.genealogy.resolution') &&
    viewSrc.includes("label: 'resolution'") &&
    viewSrc.includes('refined · ${trace.passes} pass') &&
    (viewSrc.match(/speak\(/g) ?? []).length >= 7);

// ---------------------------------------------------------------------------
// §7 the two re-seals READ (manifest :87 / :49 vs the working bytes)
// ---------------------------------------------------------------------------
console.log('\n----- §7 the register law holds: both re-seals read -----');
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
const shaOf = (p) =>
  crypto.createHash('sha256').update(fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '')).digest('hex');
const rowOf = (p) => {
  const row = manifest.split(/\r?\n/).find((line) => line.startsWith(p));
  return row ? row.trim().split(/\s+/).pop() : null;
};
check('§7 manifest row for src/types/geometry.ts === sha256(CR-stripped working bytes) — the re-seal is LIVE',
  rowOf('src/types/geometry.ts') === shaOf('src/types/geometry.ts'));
check('§7 manifest row for src/lib/genealogyDag.ts === sha256(CR-stripped working bytes) — the re-seal is LIVE',
  rowOf('src/lib/genealogyDag.ts') === shaOf('src/lib/genealogyDag.ts'));

console.log(
  `\n--- REFINE'S WORD (named · carried · non-begetting · read): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

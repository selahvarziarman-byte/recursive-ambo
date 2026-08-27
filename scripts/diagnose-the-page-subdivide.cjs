#!/usr/bin/env node

// DIAGNOSTIC — FIX 2b, THE PAGE SUBDIVIDE: the person's DIRECT subdivide
// (subdivideFace → chordSplitFor → applyChordToWritten, persisted by the
// view's handleChordCommit) carries its honest record ALONGSIDE the birth
// word — `genealogy.resolution` PRESENT, `operation` UNTOUCHED. A form is
// BORN ONCE: the birth edge keeps its own word and its own death semantics.
//
// THE TEETH (this witness BITES — an operation-overwrite plant mislabels the
// birth edge / drops the node from the walk → RED; a dropped resolution →
// RED):
//   §1 ★ BORN ONCE, both death flavors, REAL page subjects:
//      · the thicken BAND (word 'product', NON-consuming): the chord splits
//        a distinct-cornered 4-gon; the split shape keeps word 'product',
//        carries the record, χ fixed; the DAG edge stays product/death=false
//        node-for-node;
//      · the combine CHILD of an equalized torus ⊕ the band (word 'assemble',
//        consuming): applyChordToWritten reshapes IN PLACE (id kept); word
//        stays 'assemble', record present, χ fixed; the DAG over the family
//        is KEY-EQUAL before/after and the child STAYS LIVE with its
//        assemble/death=true edges;
//      · the FOLD WALL, measured: a fold-born quotient form REFUSES the
//        chord by subdivideFace's own disk-law sentence — the person's
//        direct subdivide cannot even reach a 1-face quotient page form, so
//        born-once holds there vacuously and BY THE WALL;
//   §2 ★ the OWN-CARD reader: the specimen's presence-keyed sources now
//      lead with `entry.form.shape` (dedup by id), speak 'this form', and
//      the carried-parents path is byte-intact (additive only);
//   §3 the record RIDES value-equal: subdivideFace's returned record ===
//      the record on the shape (reference), through chordSplitFor and
//      applyGateChords, and the reshaped child's riding record equals the
//      record an identical subdivideFace call mints (deterministic);
//   §4 the SWEEP, named and grepped: subdivideFace is the ONE page-writer
//      and stamps ALONGSIDE (no `operation:` write in its slice); the
//      combine routes keep their full 'refine' stamp (discarded
//      intermediates); prepareFormForSew stays classified — a discarded
//      intermediate writing NO resolution; the view persists the reshape;
//   §5 ZERO frozen touch: geometry.ts · genealogyDag.ts · the manifest are
//      CR-insensitively BYTE-IDENTICAL to HEAD — no re-seal in this fix.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { thicken } = req('src/lib/thicken.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { refineToDisk, subdivideFace, equalizePreparedDisks } = req('src/lib/surfaceRefinement.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { birthChild } = req('src/manuscript/genesisModel.ts');
const { chordSplitFor, applyChordToWritten, applyGateChords, applyFoldTo } = req('src/manuscript/handGestureModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
let seq = 600;

const chi = (s) => Object.keys(s.vertices).length - s.edges.length + s.faces.length;
const dagKey = (d) =>
  JSON.stringify({
    nodes: d.nodes.map((n) => `${n.id}:${n.birthOperation}`).sort(),
    edges: d.edges.map((e) => `${e.parent}->${e.child}:${e.operation}:${e.consuming}`).sort(),
    live: [...d.unconsumedAtEnd].sort(),
  });
const chordAimOn = (shape) => {
  const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const existing = new Set(shape.edges.map((e) => pairKey(e.vertexIds[0], e.vertexIds[1])));
  for (const f of shape.faces) {
    const cyc = f.vertexIds;
    if (new Set(cyc).size !== cyc.length || cyc.length < 4) continue;
    for (let i = 0; i < cyc.length; i += 1) {
      for (let j = 0; j < cyc.length; j += 1) {
        const d = (j - i + cyc.length) % cyc.length;
        if (d === 0 || d === 1 || d === cyc.length - 1) continue;
        if (existing.has(pairKey(cyc[i], cyc[j]))) continue;
        return { faceId: f.id, cornerA: cyc[i], cornerB: cyc[j], face: f };
      }
    }
  }
  return null;
};

console.log('THE PAGE SUBDIVIDE (FIX 2b): the honest word rides ALONGSIDE the birth — born once\n');

// ---------------------------------------------------------------------------
// §1 ★ BORN ONCE — both death flavors on REAL page subjects
// ---------------------------------------------------------------------------
console.log('----- §1 ★ born once: the birth word and its death semantics survive the reshape -----');

// flavor A — the thicken BAND (word 'product', NON-consuming birth)
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
}), 'ps');
const band = thicken(ring).shape;
const bandAim = chordAimOn(band);
check("§1 the band is a REAL chord-able page subject (word 'product', distinct-cornered 4-gons)",
  band.genealogy.operation === 'product' && bandAim !== null);
const bandSplit = bandAim ? chordSplitFor(band, bandAim.faceId, bandAim.cornerA, bandAim.cornerB) : { ok: false };
check("★ §1 BAND: the chord splits and the word STAYS 'product' — NEVER 'refine' — with the record PRESENT alongside",
  bandSplit.ok === true &&
    bandSplit.shape.genealogy.operation === 'product' &&
    bandSplit.shape.genealogy.resolution?.typeClaim === 'resolution');
check('★ §1 BAND: χ cannot move (measured 0→0) and the DAG edge stays product/death=false, node-for-node',
  bandSplit.ok === true &&
    chi(band) === 0 && chi(bandSplit.shape) === 0 &&
    (() => {
      const d0 = buildGenealogyDag([ring, band]);
      const d1 = buildGenealogyDag([ring, bandSplit.shape]);
      return dagKey(d0) === dagKey(d1) &&
        d1.edges.length === 1 && d1.edges[0].operation === 'product' && d1.edges[0].consuming === false;
    })());

// flavor B — the combine CHILD (word 'assemble', consuming birth), reshaped IN PLACE
const mkTorus = (ns) => {
  const host = loadForm(nGon(4), ns);
  const born = applyPlaygroundOperationTo('glue-torus', host, null, (seq += 1), 24, [], null);
  const refined = refineToDisk(born.born.shape, host);
  return { host, born: born.born.shape, refined, disk: refined.shape.faces.find((f) => f.id.endsWith(':disk')) ?? null };
};
const T = mkTorus('psT');
const eq = equalizePreparedDisks({ shape: T.refined.shape, disk: T.disk }, { shape: band, disk: null });
const bandPort = band.faces.find((f) => f.id !== '') ?? band.faces[0];
const birth = eq.equalized === 'a'
  ? birthChild(eq.a.shape, band, (seq += 1), eq.a.disk, band.faces[1] ?? bandPort, 24)
  : { ok: false, reason: 'equalize did not fire' };
check("§1 the equalized torus ⊕ band birth LANDS (the manuscript's own equal-rims law satisfied by the committed equalize)",
  eq.equalized === 'a' && birth.ok === true && birth.born.shape.genealogy.operation === 'assemble');
let reshaped = null;
if (birth.ok) {
  const child = birth.born.shape;
  const aim = chordAimOn(child);
  check("§1 the child keeps the band's distinct 4-gons — a REAL person-aimable face survives the sum", aim !== null);
  if (aim) {
    const res = applyChordToWritten(birth.born, [eq.a.shape, band], { faceId: aim.faceId, cornerA: aim.cornerA, cornerB: aim.cornerB }, 24);
    check('§1 applyChordToWritten reshapes IN PLACE (ok · id kept · render re-derived)',
      res.ok === true && res.ok && res.reshaped.shape.id === child.id);
    if (res.ok) {
      reshaped = res.reshaped;
      const rs = reshaped.shape;
      note(`child reshaped: word '${rs.genealogy.operation}' · resolution ${rs.genealogy.resolution ? 'present' : 'ABSENT'} · χ ${chi(rs)}`);
      check("★ §1 CHILD: operation STAYS 'assemble' — NEVER 'refine' — with the record PRESENT alongside (χ −2 fixed)",
        rs.genealogy.operation === 'assemble' &&
          rs.genealogy.resolution?.typeClaim === 'resolution' &&
          chi(rs) === -2);
      const p0 = buildGenealogyDag([T.born, ring, band, child]);
      const p1 = buildGenealogyDag([T.born, ring, band, rs]);
      note(`family DAG edges: [${p0.edges.map((e) => `${e.operation}/${e.consuming}`).sort().join(', ')}]`);
      check('★ §1 CHILD: the family DAG is KEY-EQUAL before/after the reshape — the birth edges keep assemble/death=true, the child STAYS LIVE, nothing relabeled',
        dagKey(p0) === dagKey(p1) &&
          p1.edges.filter((e) => e.child === rs.id).every((e) => e.operation === 'assemble' && e.consuming === true) &&
          p1.unconsumedAtEnd.includes(rs.id));
    }
  }
}

// the FOLD WALL — measured: a 1-face quotient page form cannot even receive the chord
const tri = loadForm(nGon(3), 'psF');
const fold = applyFoldTo(tri, null, undefined, [{ edgeA: 0, edgeB: 1, mode: 'reversing' }], (seq += 1), 24);
const foldWall = (() => {
  if (!fold.ok) return null;
  const f0 = fold.born.shape.faces[0];
  const split = chordSplitFor(fold.born.shape, f0.id, f0.vertexIds[0], f0.vertexIds[2] ?? f0.vertexIds[0]);
  return split.ok ? null : split.reason;
})();
note(`fold wall: ${foldWall ? `"${foldWall.slice(0, 96)}…"` : 'NO refusal (unexpected)'}`);
check("§1 the FOLD WALL: a fold-born quotient form (word 'flip-glue') REFUSES the chord by the disk-law's own sentence — born-once holds there BY THE WALL",
  fold.ok === true &&
    fold.born.shape.genealogy.operation === 'flip-glue' &&
    foldWall !== null &&
    foldWall.includes('repeats a corner class') &&
    foldWall.includes('not a disk'));

// ---------------------------------------------------------------------------
// §2 ★ the OWN-CARD reader (additive; carried-parents path intact)
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★ the own-card reader: presence-keyed, the form itself speaks first -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check("★ §2 the presence-keyed sources LEAD with the form's own shape and dedup by id",
  viewSrc.includes('[entry.form.shape, entry.form.parentShape, ...(entry.form.parentShapes ?? [])]') &&
    viewSrc.includes('seen.has(parent.id)'));
check("★ §2 the own row names itself 'this form' (and a parent row keeps the parent's name) — read by PRESENCE, never by word",
  viewSrc.includes("parent.id === entry.form.shape.id ? 'this form' : parent.name || parent.id") &&
    viewSrc.includes("label: 'resolution'"));
check('§2 the carried-parents path is INTACT (additive only — the combine-parent tokens all still present)',
  viewSrc.includes('entry.form.parentShape') &&
    viewSrc.includes('entry.form.parentShapes ?? []') &&
    viewSrc.includes('refined · ${trace.passes} pass'));
check('§2 the view PERSISTS the reshape as the written form (handleChordCommit → setWritten, in place)',
  viewSrc.includes('applyChordToWritten(entry.form, target.ancestry, aim, layoutCtl.resolution)') &&
    /w\.form\.id === entry\.form\.id \? \{ \.\.\.w, form: result\.reshaped \}/.test(viewSrc));

// ---------------------------------------------------------------------------
// §3 the record RIDES value-equal at every hop
// ---------------------------------------------------------------------------
console.log('\n----- §3 the ride: one record, on the shape, at every hop -----');
if (bandAim) {
  const sub = subdivideFace(band, bandAim.face, bandAim.cornerA, bandAim.cornerB);
  check('§3 subdivideFace: the riding record IS the returned record (reference-equal)',
    sub.shape.genealogy.resolution === sub.refinement);
  check('§3 chordSplitFor and applyGateChords carry it VALUE-EQUAL (the shape is the vehicle — no hop can drop it)',
    bandSplit.ok === true &&
      JSON.stringify(bandSplit.shape.genealogy.resolution) === JSON.stringify(sub.refinement) &&
      JSON.stringify(
        applyGateChords(band, [{ faceId: bandAim.faceId, cornerA: bandAim.cornerA, cornerB: bandAim.cornerB }])
          .genealogy.resolution,
      ) === JSON.stringify(sub.refinement));
}
check('§3 the reshaped child rides the record an identical subdivideFace call mints (deterministic ids — value-equal)',
  reshaped !== null &&
    (() => {
      const child = birth.born.shape;
      const aim = chordAimOn(child);
      if (!aim) return false;
      const fresh = subdivideFace(child, aim.face, aim.cornerA, aim.cornerB);
      return JSON.stringify(reshaped.shape.genealogy.resolution) === JSON.stringify(fresh.refinement);
    })());

// ---------------------------------------------------------------------------
// §4 the SWEEP — named, classified, grepped
// ---------------------------------------------------------------------------
console.log('\n----- §4 the sweep: ONE page-writer, stamped ALONGSIDE; every other caller classified -----');
const refSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/surfaceRefinement.ts'), 'utf8').replace(/\r/g, '');
const sliceFn = (src, marker) => {
  const at = src.indexOf(marker);
  if (at < 0) return null;
  return src.slice(at, src.indexOf('\n}', at) + 2);
};
const subSlice = sliceFn(refSrc, 'export function subdivideFace(');
check("§4 subdivideFace (THE page-writer, via chordSplitFor → applyChordToWritten): stamps `resolution` ALONGSIDE and writes NO `operation:` (born once, structurally)",
  subSlice !== null &&
    subSlice.includes('genealogy: { ...shape.genealogy, resolution: refinement }') &&
    !subSlice.includes("operation: 'refine'"));
check("§4 the combine routes keep their FULL 'refine' stamp (discarded intermediates — REFINE'S WORD, untouched)",
  (refSrc.match(/stampResolution\(out\.shape, out\.refinement\)/g) ?? []).length === 2);
const prepSlice = sliceFn(refSrc, 'export function prepareFormForSew(');
check('§4 prepareFormForSew CLASSIFIED: a discarded intermediate (rides only as the sew child\'s carried parent) — it writes NO resolution and keeps the genealogy verbatim (the optional consistency stamp is its own ruling, not taken here)',
  prepSlice !== null && !prepSlice.includes('resolution') && !prepSlice.includes('stampResolution'));
const gestureSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/handGestureModel.ts'), 'utf8');
check('§4 the handoff chain is whole: chordSplitFor returns the split SHAPE (the record rides it) and applyChordToWritten persists that shape on the written form',
  gestureSrc.includes('shape: refined.shape') &&
    gestureSrc.includes('reshaped: { ...form, shape: split.shape, render }'));

// ---------------------------------------------------------------------------
// §5 ZERO frozen touch — no re-seal in this fix
// ---------------------------------------------------------------------------
console.log('\n----- §5 zero frozen touch: the fix is wholly NOT_FROZEN -----');
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§5 src/types/geometry.ts BYTE-IDENTICAL to HEAD (no frozen touch)', headEq('src/types/geometry.ts'));
check('§5 src/lib/genealogyDag.ts BYTE-IDENTICAL to HEAD (no frozen touch)', headEq('src/lib/genealogyDag.ts'));
check('§5 the ENGINE FREEZE MANIFEST BYTE-IDENTICAL to HEAD (zero unions — no re-seal)', headEq('docs/governance/ENGINE_FREEZE_MANIFEST.txt'));

console.log(
  `\n--- THE PAGE SUBDIVIDE (born once · alongside carry · own-card reader): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

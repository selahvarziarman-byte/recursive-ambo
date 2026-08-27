#!/usr/bin/env node

// DIAGNOSTIC — B-120: THE STEMMA EDGE LABEL (E.1–E.7). The edge carries the
// OPERATION, ALONE — the only part of the record sentence the picture cannot
// show ("a line can say from this to that; it cannot say by what") — at the
// midpoint, horizontal, on attention, yielding under collision while the
// EDGE never yields, over a ≥24px pick target (R8 ported).
//
// THE TEETH:
//   §1 ★ ONE PRODUCER — a REAL glue story (the committed doors, no fixture):
//      the drawn word IS `GenealogyEdge.operation`, the same field the foot
//      record prints, so the strip and the page cannot disagree without the
//      record itself changing;
//   §2 the geometry: midpoint (E.1); arrowhead ON the segment at the CHILD
//      end, backed off, angle = the edge's own direction; a zero-length edge
//      draws NO head rather than inventing a direction (E.3);
//   §3 ★★ E.5 — THE LABEL YIELDS, THE EDGE NEVER DOES: colliding candidates
//      drop in priority order (caller's order IS the priority — the hovered
//      label first); and BY CONSTRUCTION the yield's answer reaches only the
//      label gate — the ink line, the arrowhead, and the pick stroke render
//      before and outside it;
//   §4 the wiring at the view: the invisible pick stroke at
//      STEMMA_PICK_WIDTH_PX (=24, E.7) with opacity 0; the label as the
//      page's own Html species with `data-stemma-op`, pointerEvents none,
//      NO rotation (E.2 — a DOM overlay cannot rotate with the edge), and
//      NO arrow glyph in the word (E.3 — one fact, one place); attention =
//      the edge's own hover OR the page's existing selection (E.6 — no new
//      gesture);
//   §5 ⛔ the boundary B-120 §2.3 ordered held: `death` rides NO part of the
//      label — the model and the stemma render block never read it.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const {
  STEMMA_ARROW,
  STEMMA_PICK_WIDTH_PX,
  stemmaArrowhead,
  stemmaMidpoint,
  visibleStemmaLabels,
} = req('src/manuscript/stemmaLabelModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { genesisStoryShapes, readGenesis, footRecord } = req('src/manuscript/genesisModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const stripped = (body) =>
  body
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .map((l) => l.split('//')[0])
    .join('\n');

console.log('B-120 — THE STEMMA EDGE LABEL: the operation, alone, on the line that cannot say it\n');

// ═════ §1 ONE PRODUCER — the word is the committed edge's own operation ══════
console.log('----- §1 one field, two readers: the page and the strip cannot disagree -----');
{
  const host = invokePrimitive('square', 101);
  const born = applyPlaygroundOperationTo('glue-torus', host.shape, null, 2, 24, [], null);
  check('§1 the committed glue door births the child (a REAL story, no fixture)', born.ok === true);
  const reading = readGenesis(genesisStoryShapes([{ form: host }, { form: born.born }]));
  const edge = reading.reducedEdges.find((e) => e.child === born.born.shape.id);
  check(
    "§1 ★ the reduced edge carries the operation the person performed — 'glue', the child's own birth word",
    Boolean(edge) && edge.parent === host.shape.id && edge.operation === 'glue',
  );
  const entries = footRecord(reading, (id) => id);
  const entry = entries.find((e) => e.childId === born.born.shape.id);
  check(
    '§1 ★★ ONE PRODUCER: the foot record prints THE SAME FIELD the page draws — `entry.operation === edge.operation` because both read `GenealogyEdge.operation`; neither reads the other',
    Boolean(entry) && entry.operation === edge.operation,
  );
  note(`edge ${edge ? `${edge.parent.slice(0, 8)}→${edge.child.slice(0, 8)} op=${edge.operation}` : 'MISSING'} · strip op=${entry?.operation}`);
  const view = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  check(
    '§1 and the view carries that field VERBATIM: `operation: edge.operation` through the stemma map, `word={line.operation}` at the label — no rename, no lookup, no second producer',
    view.includes('operation: edge.operation') && view.includes('word={line.operation}'),
  );
}

// ═════ §2 the geometry — E.1 midpoint · E.3 arrowhead ═══════════════════════
console.log('\n----- §2 the drawing: midpoint, and the head at the child end -----');
{
  const from = [0, 0, 0];
  const to = [10, 0, 0];
  const mid = stemmaMidpoint(from, to);
  check('§2 E.1 — the label ground is the MIDPOINT (the verb between its subject and object)', mid[0] === 5 && mid[1] === 0);
  const arrow = stemmaArrowhead(from, to);
  check(
    `§2 E.3 — the head sits ON the segment at the CHILD end, backed off ${STEMMA_ARROW.backoff} so the child's ink does not swallow it, pointing parent→child`,
    arrow !== null && arrow.tip[0] === 10 - STEMMA_ARROW.backoff && arrow.tip[1] === 0 && arrow.angleRad === 0,
  );
  const diag = stemmaArrowhead([0, 0, 0], [3, 4, 0]);
  check(
    '§2 E.3 — the angle is the edge\'s OWN direction (atan2), and a short edge backs off a fraction of itself (never past the midpoint\'s ground)',
    diag !== null &&
      Math.abs(diag.angleRad - Math.atan2(4, 3)) < 1e-12 &&
      Math.abs(Math.hypot(3 - diag.tip[0], 4 - diag.tip[1]) - 5 * STEMMA_ARROW.backoffFractionCap) < 1e-12,
  );
  check(
    '§2 E.3 — a ZERO-LENGTH edge (both forms dragged to one point) draws NO head: the drawing refuses to invent a direction the record does not hold',
    stemmaArrowhead([2, 2, 0], [2, 2, 0]) === null,
  );
  note(`long-edge tip x=${arrow?.tip[0]} · diag angle=${diag?.angleRad.toFixed(4)} (atan2(4,3)=${Math.atan2(4, 3).toFixed(4)})`);
}

// ═════ §3 E.5 — the label yields; the edge never does ═══════════════════════
console.log('\n----- §3 the yield: labels drop, ink never -----');
{
  const apart = visibleStemmaLabels([
    { key: 'a', word: 'glue', mid: [0, 0] },
    { key: 'b', word: 'cut', mid: [8, 0] },
  ]);
  check('§3 labels FAR APART both arrive — the yield fires on collision, never on company', apart.has('a') && apart.has('b'));
  const collide = visibleStemmaLabels([
    { key: 'a', word: 'glue', mid: [0, 0] },
    { key: 'b', word: 'flip-glue', mid: [0.4, 0.1] },
  ]);
  check(
    '§3 ★★ E.5 — colliding labels: the LATER one yields (first claim wins), and what yields is a WORD, never a line',
    collide.has('a') && !collide.has('b') && collide.size === 1,
  );
  const reversed = visibleStemmaLabels([
    { key: 'b', word: 'flip-glue', mid: [0.4, 0.1] },
    { key: 'a', word: 'glue', mid: [0, 0] },
  ]);
  check(
    '§3 ★ the caller\'s order IS the priority — reversed order flips the survivor, which is the contract the view uses to put the POINTER-HOVERED label first (direct attention never loses its verb to a selection\'s crowd)',
    reversed.has('b') && !reversed.has('a'),
  );
  note(`apart={${[...apart]}} · collide={${[...collide]}} · reversed={${[...reversed]}}`);
  const view = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  // ⚠ the end anchor is searched FORWARD FROM THE START — "the birth-cue"
  // also names a craft comment thousands of lines earlier, and an
  // unanchored indexOf produced an EMPTY slice (the A1 pin's own failure
  // mode, re-met and re-cured here with a positive control below).
  const mapAt = view.indexOf('{stemmaLines.map((line) => {');
  const block = view.slice(mapAt, view.indexOf('the birth-cue', mapAt));
  const gateAt = block.indexOf('stemmaLabelKeys.has(line.key)');
  check(
    '§3 ★★ BY CONSTRUCTION the yield has no channel to the ink: in the stemma render the ink <Line>, the arrowhead, and the pick stroke ALL render BEFORE the one label gate, and `stemmaLabelKeys` is read NOWHERE else in the block — a yielding label cannot take an edge with it (positive control: the slice is non-empty and holds the map)',
    mapAt > 0 &&
      block.length > 500 &&
      gateAt > 0 &&
      block.indexOf('<Line') < gateAt &&
      block.indexOf('STEMMA_ARROW_VERTICES') < gateAt &&
      block.indexOf('STEMMA_PICK_WIDTH_PX') < gateAt &&
      block.indexOf('stemmaLabelKeys') === gateAt &&
      block.lastIndexOf('stemmaLabelKeys') === gateAt &&
      /stemmaLabelKeys\.has\(line\.key\) \? \(\s*<StemmaOpLabel/.test(block),
  );
}

// ═════ §4 the wiring — E.2 · E.6 · E.7 at the view ══════════════════════════
console.log('\n----- §4 the wiring: pick target, species, attention -----');
{
  const view = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  const mapAt = view.indexOf('{stemmaLines.map((line) => {');
  const block = view.slice(mapAt, view.indexOf('the birth-cue', mapAt));
  check(
    `§4 E.7 — R8 PORTED: an INVISIBLE stroke at STEMMA_PICK_WIDTH_PX (=${STEMMA_PICK_WIDTH_PX}) px over the same segment — the ruled cure for "a hairline target and a broken door produce the same observation" (positive control: non-empty slice)`,
    block.length > 500 &&
      STEMMA_PICK_WIDTH_PX >= 24 &&
      block.includes('lineWidth={STEMMA_PICK_WIDTH_PX}') &&
      block.includes('opacity={0}'),
  );
  const label = view.slice(view.indexOf('function StemmaOpLabel'), view.indexOf('/** D.1'));
  const labelCode = stripped(label);
  check(
    '§4 E.2/E.4 — the label is the page\'s OWN species (drei Html, distanceFactor 13, pointerEvents none, data-stemma-op mark) at the quiet monospace register — and carries NO rotation: a DOM overlay is screen-horizontal at every camera angle BY CONSTRUCTION, so a dragged edge at any slope still reads in the manuscript\'s direction',
    label.includes('distanceFactor={13}') &&
      label.includes("pointerEvents: 'none'") &&
      label.includes('data-stemma-op={word}') &&
      label.includes('ui-monospace') &&
      !labelCode.includes('rotation'),
  );
  check(
    '§4 E.3 — the label does NOT repeat direction: the rendered word is `{word}` verbatim, no arrow glyph anywhere in the emitted label code',
    labelCode.includes('{word}') && !labelCode.includes('→') && !labelCode.includes('&rarr;'),
  );
  check(
    '§4 E.6 — ATTENTION, no new gesture: hover is the pick stroke\'s own pointerover — UNGUARDED, a measured decision (every form\'s native LineSegments carries three\'s default 1-world-unit raycast halo, so a nearest-hit guard can essentially never pass near an endpoint); select is the page\'s EXISTING selection (`apertureTarget?.shape.id` — the same handle the aperture already reads); the plan unions them',
    block.includes('setStemmaHover(line.key)') &&
      !stripped(block).includes('event.intersections') &&
      view.includes('const selectedShapeId = apertureTarget?.shape.id ?? null') &&
      view.includes('line.parent === selectedShapeId || line.child === selectedShapeId'),
  );
}

// ═════ §5 the boundary held — death rides nothing ═══════════════════════════
console.log('\n----- §5 the refused field stays off the drawing -----');
{
  const model = stripped(fs.readFileSync(path.join(repoRoot, 'src/manuscript/stemmaLabelModel.ts'), 'utf8'));
  const view = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  const mapAt = view.indexOf('{stemmaLines.map((line) => {');
  const block = stripped(view.slice(mapAt, view.indexOf('the birth-cue', mapAt)));
  const map = stripped(view.slice(view.indexOf('const stemmaLines = useMemo'), view.indexOf('const [stemmaHover')));
  check(
    '§5 ⛔ B-120 §2.3 HELD: `death` is read by NO part of the label — not the model, not the stemma map, not the render block. The designer refused to spend a boolean that predates ADR 0027 §4\'s three-way split, and the drawing honours the refusal by construction (positive controls: each slice non-empty and holding its own known token — an empty slice contains no `death` and would lie a PASS)',
    model.length > 500 &&
      model.includes('visibleStemmaLabels') &&
      block.length > 500 &&
      block.includes('STEMMA_ARROW_VERTICES') &&
      map.length > 100 &&
      map.includes('edge.operation') &&
      !model.includes('death') &&
      !block.includes('death') &&
      !map.includes('death'),
  );
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

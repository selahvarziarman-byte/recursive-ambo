#!/usr/bin/env node

// DIAGNOSTIC — THE WINDING HEADING FAN (engineer 1230/1300 charter): the
// STANDING form of the simulator that derived the winding route's walks.
//
// TWO PINNED FIXTURES, each a measured fact of `fdb92ca`'s tree:
//  1 · THE CONE ROOM (the aperture word d+0,d+0,d+0 — sound, `2 × 180°`):
//      heading 50° returns the entry in 2 doors with deck trace −1 (the
//      half-turn) — the walk behind the positive control's
//      `back where you started · 2 doors · the room came back turned`.
//  2 · THE FAN CHAMBER (the door-3 5-cell band, EXIT B): the planned 360°
//      circuit AROUND the k=5 pillar closes on the entry with 0 doors,
//      0 wall clamps, deck identity — ★ THE INTERIOR-TRANSPORT GAP AS A
//      STANDING PIN: the person winds 300° around a cone edge and the room
//      reads `the same way up`. ⛔ WHEN THE INTERIOR-TRANSPORT CURE LANDS
//      THIS PIN MUST FAIL — that failure is the trigger to re-derive the
//      fan's readings, not a defect.
//
// As a TOOL for the next room:  node …-headings.cjs --word d+0,d+1,d+2
// prints the straight-heading return table (deg · doors · trace · window)
// so a walk can be DERIVED rather than searched.

const path = require('node:path');
const fs = require('node:fs');
const repoRoot = path.resolve(__dirname, '..', '..');
const ts = require(path.join(repoRoot, 'node_modules', 'typescript'));
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
const req = (p) => require(path.join(repoRoot, p));
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { applyPyritohedralDiagonalization } = req('src/lib/pyritohedralDiagonalization.ts');
const { openLift } = req('src/lib/openLift.ts');
const { thicken } = req('src/lib/thicken.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const A = req('src/manuscript/apertureModel.ts');
const { ENTRY, simulateWalk, straightLine } = require('./lib/windingWalk.cjs');

const cube = createSeedShape('cube');
const pairs = [
  ['face:cube:left', 'face:cube:right'],
  ['face:cube:top', 'face:cube:bottom'],
  ['face:cube:front', 'face:cube:back'],
];
const roomFromWord = (word) =>
  A.buildPersonDomainVerdict(
    cube,
    pairs.map((p, i) => ({ faceA: p[0], faceB: p[1], candidateKey: word[i] })),
    'headings',
    'headings',
  ).domain;

const headingTable = (surface) => {
  const rows = [];
  for (let a = 0; a < 72; a += 1) {
    const th = (a / 72) * 2 * Math.PI;
    const sim = simulateWalk(surface, ENTRY, straightLine(ENTRY, [Math.cos(th), Math.sin(th), 0], 14, 700), {
      returnEps: 0.3,
    });
    if (!sim.returned) continue;
    // the return WINDOW: how much further the straight walk stays inside
    // the ball (the drive's landing margin)
    rows.push({
      deg: Math.round((th * 180) / Math.PI),
      doors: sim.doorsAtReturn,
      trace: Math.round(sim.traceAtReturn * 100) / 100,
      handed: sim.handedness < 0 ? -1 : 1,
    });
  }
  return rows;
};

// ---- the TOOL mode ---------------------------------------------------------
const wordArg = process.argv.find((a) => a.startsWith('--word'));
if (wordArg) {
  const word = (process.argv[process.argv.indexOf(wordArg) + 1] ?? wordArg.split('=')[1]).split(',');
  const domain = roomFromWord(word);
  const surface = A.readCellSurface(domain, true);
  console.log(`word ${word.join(',')} · sound ${domain.tower.sound}`);
  for (const r of headingTable(surface)) console.log(`  ${r.deg}° → ${r.doors} doors · trace ${r.trace} · handed ${r.handed}`);
  process.exit(0);
}

// ---- the WITNESS mode ------------------------------------------------------
console.log('I simulate walks over readCellSurface transports; I do NOT render.');
let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

// fixture 1 — the cone room
{
  const domain = roomFromWord(['d+0', 'd+0', 'd+0']);
  const gate = A.buildAperture(domain);
  check(
    '(1a) the fixture stands: d+0,d+0,d+0 is SOUND and declares `2 × 180°`',
    domain.tower.sound && gate.ok && gate.geometry.coneEdges === '2 × 180°',
    gate.ok ? gate.geometry.label.slice(0, 70) : 'gate refused',
  );
  const surface = A.readCellSurface(domain, true);
  const sim = simulateWalk(surface, ENTRY, straightLine(ENTRY, [Math.cos(Math.PI * 50 / 180), Math.sin(Math.PI * 50 / 180), 0], 6, 300), { returnEps: 0.3 });
  check(
    '(1b) heading 50°: the straight walk returns the entry in 2 DOORS with deck trace −1 (the half-turn — the positive control\'s own walk)',
    sim.returned && sim.doorsAtReturn === 2 && Math.abs(sim.traceAtReturn - -1) < 1e-6 && sim.handedness > 0,
    `returned ${sim.returned} · doors ${sim.doorsAtReturn} · trace ${sim.traceAtReturn}`,
  );
}

// fixture 2 — the fan chamber + the pillar circuit
{
  const seed = createSeedShape('cube');
  const ambo = applyAmboDissection(seed);
  const cubocta = ambo.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
  const terrain = applyPyritohedralDiagonalization(ambo, cubocta.id);
  const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
  const mid = Object.values(terrain.vertices).find(
    (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
  ).id;
  const lift = openLift(terrain, mid, coreCell.id);
  const segment = {
    id: 's',
    name: 's',
    vertices: {
      s0: { id: 's0', position: [0, 0, 0], data: { label: 's0' }, createdBy: { shapeId: 's', operation: 'seed', sourceVertexIds: [] } },
      s1: { id: 's1', position: [0, 0, 1], data: { label: 's1' }, createdBy: { shapeId: 's', operation: 'seed', sourceVertexIds: [] } },
    },
    edges: [{ id: 'e01', vertexIds: ['s0', 's1'] }],
    faces: [],
    cells: [],
    generations: [],
    genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
  };
  const band = thicken(lift.shape, segment).shape;
  const domain = buildFormDomain(band, [], 'fan', 'the fan chamber');
  const surface = A.readCellSurface(domain, true);
  const portals = surface.faces.filter((f) => f.g && !f.wall).length;
  const pillar = surface.rods.find((r) => r.k === 5);
  check(
    '(2a) the fixture stands: the fan chamber is DECKLESS (15 walls, 0 portals — the interior faces are stripped) and carries the k=5 pillar',
    surface.faces.length === 15 && portals === 0 && Boolean(pillar),
    `faces ${surface.faces.length} · portals ${portals} · pillar ${pillar ? 'k=5' : 'MISSING'}`,
  );
  // the planned circuit: entry → staging → 360° around the pillar's
  // z=0.1 piercing point (0.43, −0.45) at r 0.35 → home
  const CTR = [0.43, -0.45, 0.1];
  const R = 0.35;
  const plan = [ENTRY, [CTR[0] + R, CTR[1], 0.1]];
  for (let i = 1; i <= 16; i += 1) {
    const th = (i / 16) * 2 * Math.PI;
    plan.push([CTR[0] + R * Math.cos(th), CTR[1] + R * Math.sin(th), 0.1]);
  }
  plan.push(ENTRY);
  const sim = simulateWalk(surface, ENTRY, plan);
  const dEnd = Math.hypot(sim.eye[0] - ENTRY[0], sim.eye[1] - ENTRY[1], sim.eye[2] - ENTRY[2]);
  check(
    '(2b) ★ THE INTERIOR-TRANSPORT GAP, PINNED: the 360° circuit around the k=5 pillar closes on the entry with 0 doors, 0 clamps, deck IDENTITY — the person winds a cone edge and the room reads `the same way up`. ⛔ WHEN THE INTERIOR-TRANSPORT CURE LANDS, THIS PIN FAILS — that is the trigger to re-derive the fan\'s readings, not a defect',
    dEnd < 1e-3 && sim.doors === 0 && sim.clamps === 0 && Math.abs(sim.trace - 3) < 1e-9,
    `dEntry ${dEnd.toFixed(4)} · doors ${sim.doors} · clamps ${sim.clamps} · trace ${sim.trace.toFixed(3)}`,
  );
}

console.log(failures === 0 ? '\nDIAGNOSE-WINDING-HEADINGS: ALL GREEN' : `\nDIAGNOSE-WINDING-HEADINGS: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

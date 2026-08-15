#!/usr/bin/env node

// DIAGNOSTIC — D2: THE ONE DOOR (2026-08-15 amended mandate; sovereign-ruled:
// "building manifold-3 becomes real on the user's choice over the shapes,
// not a given set of shapes"). The aperture is a view onto the volume the
// person points at; the apertureSeed machine is dissolved; the cube is the
// degenerate case of the one rule.
//
// ★ THE CARRY DECLARATION: I hand in solids and drive the DOOR'S MODEL seams
// (boundaryFacesOf, the row law, the verdict dispatch, both exits); the view
// wiring is source-pinned; I do NOT click, walk, or render — the mothership's
// live drive is the real gate.
//
// THE SEALED VALUES (engineer 1420, falsifiable):
//   cube: 6 raw faces · derived rows ⌊6/2⌋ = 3 · behavior unmoved;
//   fan×I (5 cells, 20 faces): 5 interior shared walls · 15 prefixed 1-owner
//   faces (10 triangles + 5 rim rectangles) · rows ⌊15/2⌋ = 7 · EXIT B
//   reproduces the sealed room (sound, v12 e26 f20 c5, walls 15, doors 0,
//   caption `cone edges (measured): 1 × 300°`).
//   EXIT A: PRINTED, not sealed (the engineer's own honesty rule).

const fs = require('node:fs');
const path = require('node:path');
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
const { sharedWallPairings, buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const A = req('src/manuscript/apertureModel.ts');

console.log('I hand in solids and drive the door\'s model seams; the view wiring is source-pinned; I do NOT click, walk, or render.');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

// ---- the two volumes -------------------------------------------------------
const cube = createSeedShape('cube');
const cube1 = applyAmboDissection(createSeedShape('cube'));
const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;
const lift = openLift(terrain, mid, coreCell.id);
const fan = thicken(lift.shape).shape;

// ---- (a) the face menu: one rule, both id spaces ---------------------------
console.log('\n— (a) boundaryFacesOf: the one rule, both id spaces —');
const cubeMenu = A.boundaryFacesOf(cube);
check('(a) the cube (degenerate case): ALL 6 faces offered, RAW ids · derived rows ⌊6/2⌋ = 3 reproduce the committed fixed three BY CONSTRUCTION',
  cubeMenu.length === 6 && cubeMenu.every((f) => !f.id.startsWith('c0:')) && Math.floor(cubeMenu.length / 2) === 3,
  `${cubeMenu.length} faces · e.g. ${cubeMenu[0].id}`);
const shared = sharedWallPairings(fan);
const fanMenu = A.boundaryFacesOf(fan);
const fanTris = fanMenu.filter((f) => { const raw = f.id.replace(/^c\d+:/, ''); return fan.faces.find((x) => x.id === raw).vertexIds.length === 3; });
const fanQuads = fanMenu.filter((f) => { const raw = f.id.replace(/^c\d+:/, ''); return fan.faces.find((x) => x.id === raw).vertexIds.length === 4; });
check('(a) the fan×I: exactly 5 interior shared walls · exactly 15 PREFIXED 1-owner faces (10 triangles + 5 rim rectangles) · rows ⌊15/2⌋ = 7',
  shared.length === 5 && fanMenu.length === 15 && fanMenu.every((f) => /^c\d+:/.test(f.id)) &&
    fanTris.length === 10 && fanQuads.length === 5 && Math.floor(fanMenu.length / 2) === 7,
  `${shared.length} walls · ${fanMenu.length} boundary (${fanTris.length}T+${fanQuads.length}Q)`);
const interiorRaw = new Set(shared.flatMap((p) => [p.faceA.replace(/^c\d+:/, ''), p.faceB.replace(/^c\d+:/, '')]));
check('(a) NEVER a 2-owner face: no interior wall appears in the menu',
  fanMenu.every((f) => !interiorRaw.has(f.id.replace(/^c\d+:/, ''))));
// the pinch guard: a cell citing one face twice must REFUSE by name, never hide
{
  const pinched = { ...fan, cells: fan.cells.map((c, i) => (i === 0 ? { ...c, faceIds: [...c.faceIds, c.faceIds[0]] } : c)) };
  let fired = false;
  try {
    A.boundaryFacesOf(pinched);
  } catch (e) {
    fired = /pinched/.test(String(e.message)) && /refused by name/.test(String(e.message));
  }
  check('(a) ★ THE PINCH GUARD FIRES rather than hiding: a cell citing a face twice is refused BY NAME', fired);
}
// a surface (0 cells) is refused by name as a volume
{
  let refused = false;
  try {
    A.boundaryFacesOf(lift.shape);
  } catch (e) {
    refused = /surface, not a solid/.test(String(e.message));
  }
  check('(e) a SURFACE (0 cells) is refused BY NAME — never a silent disable', refused);
}

// ---- (b) the row law admits a multi-cell volume ----------------------------
console.log('\n— (b) the row law, one law both worlds —');
const zeroRows = [{ faceA: null, faceB: null, candidateKey: null }];
check('(b) zero pairs on the FAN returns the committed one honest global refusal (the row law body byte-unchanged, now reachable multi-cell)',
  String(A.aperturePairingRefusal(fan, zeroRows)).includes('pick at least one pair'),
  String(A.aperturePairingRefusal(fan, zeroRows)).slice(0, 60));
const halfRow = [{ faceA: fanMenu[0].id, faceB: null, candidateKey: null }];
check('(f1) a HALF-PICKED row on the fan is refused by name (no crash)',
  String(A.aperturePairingRefusal(fan, halfRow)).includes('one face is picked and its partner is not'));
check('(b) the cube\'s row law is byte-behavior-identical (zero pairs → the same committed sentence)',
  String(A.aperturePairingRefusal(cube, zeroRows)).includes('pick at least one pair'));

// ---- (c) EXIT B reproduces the sealed room ---------------------------------
console.log('\n— (c) EXIT B: LEAVE BOUNDED, chosen not defaulted —');
const exitB = buildFormDomain(fan, [], 'd2-exitB', 'the chosen bounded chamber');
const cB = exitB.complex.counts;
const gateB = A.buildAperture(exitB, { base: lift.shape });
check('(c) EXIT B (explicit 0 pairs) reproduces the sealed room: sound, v12 e26 f20 c5 · doors 0 · walls 15 · caption still measured 1 × 300°',
  exitB.tower.sound === true && cB.v === 12 && cB.e === 26 && cB.f === 20 && cB.c === 5 &&
    gateB.ok === true && gateB.deck.length === 0 &&
    gateB.geometry.label.includes('cone edges (measured): 1 × 300°') &&
    A.readCellSurface(exitB, true).wallCount === 15,
  `${JSON.stringify(cB)} · deck ${gateB.ok ? gateB.deck.length : '—'}`);

// ---- (d) EXIT A seats a deck — PRINTED, not sealed -------------------------
console.log('\n— (d) EXIT A: one boundary pair, counts PRINTED (the engineer seals nothing here) —');
{
  const [fa, fb] = [fanTris[0].id, fanTris[1].id];
  const candidates = A.dihedralMapCandidates(fan, fa, fb).filter((c) => c.derivedMode === 'preserving');
  const rows = [{ faceA: fa, faceB: fb, candidateKey: candidates[0].key }];
  const verdict = A.buildPersonDomainVerdict(fan, rows, 'd2-exitA', 'the one-pair room');
  if (verdict.folded) {
    console.log(`  EXIT A verdict: FOLDED at ${verdict.foldedEdgeClasses.join(', ')} (the wall spoke; printed, not sealed)`);
    check('(d) EXIT A returned a VERDICT (folded — the wall spoke by name, no crash)', true);
  } else {
    const cA = verdict.domain.complex.counts;
    const gA = A.buildAperture(verdict.domain, { base: lift.shape });
    const surfA = gA.ok ? A.readCellSurface(verdict.domain, false) : null;
    console.log(`  EXIT A printed: sound=${verdict.domain.tower.sound} · counts=${JSON.stringify(cA)} · doors=${gA.ok ? gA.deck.length : '—'} · walls=${surfA ? surfA.wallCount : '—'}`);
    check('(d) EXIT A seats a deck (doors ≥ 1) on the paired room — counts printed above', gA.ok === true && gA.deck.length >= 1);
  }
}

// ---- (f2) a reversing pick refused BY NAME ---------------------------------
{
  // search the boundary triangles for the first pair that OFFERS a realizable
  // reversing candidate (non-symmetric faces realize few correspondences)
  let found = null;
  outer: for (let i = 0; i < fanTris.length && !found; i += 1) {
    for (let j = i + 1; j < fanTris.length; j += 1) {
      try {
        const rev = A.dihedralMapCandidates(fan, fanTris[i].id, fanTris[j].id).filter((c) => c.derivedMode === 'reversing');
        if (rev.length > 0) {
          found = { fa: fanTris[i].id, fb: fanTris[j].id, key: rev[0].key };
          break outer;
        }
      } catch {
        // a non-congruent pair — not this one
      }
    }
  }
  let named = false;
  if (found) {
    try {
      A.buildPersonDomainVerdict(fan, [{ faceA: found.fa, faceB: found.fb, candidateKey: found.key }], 'd2-rev', 'rev');
    } catch (e) {
      named = /REVERSING/.test(String(e.message)) && /refused by name/.test(String(e.message));
    }
  }
  check('(f2) a REVERSING pick on the multi-cell volume is refused BY NAME (never a crash into the committed wall)', Boolean(found) && named,
    found ? `${found.fa.slice(0, 18)}~${found.fb.slice(0, 18)}` : 'no reversing candidate offered anywhere (report if so)');
}

// ---- (h) the cube's committed door is unmoved ------------------------------
console.log('\n— (h) the cube unmoved (the deep byte-behavior fence is diagnose-the-aperture, ALL PASS in this same tree) —');
check('(h) buildPersonDomainVerdict still walks the cube\'s committed single-cell path (a T³-style pairing gates and builds)', (() => {
  const faces = cubeMenu.map((f) => f.id);
  const cands = A.dihedralMapCandidates(cube, faces[0], faces[1]).filter((c) => c.derivedMode === 'preserving');
  const verdict = A.buildPersonDomainVerdict(cube, [{ faceA: faces[0], faceB: faces[1], candidateKey: cands[0].key }], 'd2-cube', 'cube room');
  return verdict.folded === false && verdict.domain.tower.sound === true;
})());

// ---- the view wiring, source-pinned ----------------------------------------
console.log('\n— the door\'s view wiring (source pins) —');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('view · the seed machine is DISSOLVED: no setApertureSeed, no apertureSeedBaseId anywhere',
  !viewSrc.includes('setApertureSeed(') && !viewSrc.includes('apertureSeedBaseId'));
check('view · the door reads the pointed-at volume: apertureVolume from targetFor(selected); refusals by name; the menu from boundaryFacesOf; derived row count; both exits wired; the :2411 cure reads the volume',
  viewSrc.includes('const apertureVolume') &&
    viewSrc.includes('boundaryFacesOf(apertureVolume)') &&
    viewSrc.includes('this form is a surface, not a solid') &&
    viewSrc.includes('Math.floor(apertureFaceMenu.length / 2)') &&
    viewSrc.includes('handleApertureLeaveBounded') &&
    viewSrc.includes('subdivideAndReadPersonDomain(apertureVolume, apertureFoldedRows)'));

console.log(failures === 0 ? '\nDIAGNOSE-D2-ONE-DOOR: ALL GREEN' : `\nDIAGNOSE-D2-ONE-DOOR: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

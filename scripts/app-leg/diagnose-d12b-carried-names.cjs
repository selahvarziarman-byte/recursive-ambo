#!/usr/bin/env node

// DIAGNOSTIC — D12-b (engineer 1740, THE WHOLE MANDATE): THE THICKENED ROOM
// SPEAKS ITS CARRIED NAMES — parts 1 + 4 built; part 2 HELD as a SCAFFOLD.
//
// ★ THE CARRY DECLARATION: I hand in the Sovereign's route (ambo → lift a
// triangle → thicken) at model level AND drive it on the RUNNING app
// (lift parcel through the person's file door · the segment INVOKED at the
// palette · the real thicken chip · the band through the shelf · the door);
// I do NOT walk or render. What I supplied for myself: the LIFT parcel is
// minted outside through the committed doors (the in-app ambo/lift gestures
// are not driven); the app route begins at the shelf + the palette.
//
// THE RULING (researcher, ratified): a packet label is a NAME iff real
// content is positively present; absence is TRUE absence; presence-first,
// lineage-on-absence. Part 1: thicken:175 writes ABSENCE (never the copy's
// id, never the source's name). Part 4: the door resolves absence through
// `createdBy.sourceVertexIds` + the per-corner SUBSCRIPT level mark read
// from the copy id's own `@k` tail. Part 2 HELD: the `=== id` scaffold
// stands (13 manufacturers live; deleting it prints ids as names).
//
// ⛔⛔ THE NON-REGRESSION PINS (all three offices, by name): the fold-born
// loop · the materialize mint · the zoo bodies EACH still read `unnamed`.

const { spawn, execFileSync } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const repoRoot = path.resolve(__dirname, '..', '..');
const PORT = 5199;
const URL = `http://localhost:${PORT}/?manuscript`;

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

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
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { liftSubComplex } = req('src/lib/subComplexLift.ts');
const { thicken } = req('src/lib/thicken.ts');
const { closeSegmentIntoLoop } = req('src/lib/closeEdgeIntoCircle.ts');
const { buildClassBody } = req('src/manuscript/standardBodies.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const A = req('src/manuscript/apertureModel.ts');

console.log(
  'I hand in the route at model level and drive it on the running app; I do NOT walk or render.\n' +
    'Supplied: the LIFT parcel minted outside (committed doors); the app route begins at the shelf + the palette.\n',
);

// ---- the shared fixtures: the Sovereign's route, in-model ------------------
const cube = createSeedShape('cube');
const ambo = applyAmboDissection(cube);
const mids = new Set(
  Object.values(ambo.vertices)
    .filter((v) => v.createdBy?.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2)
    .map((v) => v.id),
);
const tri = ambo.faces.find((f) => f.vertexIds.length === 3 && f.vertexIds.every((id) => mids.has(id)));
const lift = liftSubComplex(ambo, [{ kind: 'face', id: tri.id }]).shape;
const inlineSegment = () => ({
  id: 'shape:d12b-seg',
  name: 'd12b seg',
  vertices: {
    s0: { id: 's0', position: [0, 0, 0], data: { label: 's0' }, createdBy: { shapeId: 'shape:d12b-seg', operation: 'seed', sourceVertexIds: [] } },
    s1: { id: 's1', position: [0, 0, 1], data: { label: 's1' }, createdBy: { shapeId: 'shape:d12b-seg', operation: 'seed', sourceVertexIds: [] } },
  },
  edges: [{ id: 'e:s0-s1', vertexIds: ['s0', 's1'] }],
  faces: [],
  cells: [],
  generations: [],
  genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
});
const band = thicken(lift, inlineSegment()).shape;

// the view's resolver, replicated over a page population (agreement law +
// the one-namespace-layer suffix, exactly the wired code path's shape)
const resolverOver = (shapes) => (sourceVertexIds) => {
  const ref = sourceVertexIds[0];
  if (!ref) return null;
  const labels = new Set();
  for (const s of shapes) {
    for (const v of Object.values(s.vertices)) {
      if (v.id !== ref && !ref.endsWith(`:${v.id}`)) continue;
      const raw = typeof v.data?.label === 'string' ? v.data.label.trim() : '';
      if (raw.length === 0 || raw === v.id) continue;
      labels.add(raw);
    }
  }
  return labels.size === 1 ? [...labels][0] : null;
};
const resolve = resolverOver([lift, ambo]);

// ---- (a) part 1: the manufacture is STOPPED --------------------------------
console.log('— (a) part 1 · thicken writes ABSENCE (never the copy id, never the source name) —');
const bandVs = Object.values(band.vertices);
check(
  '(a1) EVERY ×I copy label is the empty absence — no id-copy, no source-name copy',
  bandVs.length === 6 && bandVs.every((v) => v.data.label === ''),
  `${bandVs.length} copies, labels ${JSON.stringify([...new Set(bandVs.map((v) => v.data.label))])}`,
);
const thickenSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/thicken.ts'), 'utf8');
check(
  "(a2) the mint's source pin: createDefaultVertexData('') — the manufacture line is gone",
  thickenSrc.includes("data: createDefaultVertexData('')") && !thickenSrc.includes('createDefaultVertexData(copyId)'),
);

// ---- (b) the Sovereign's route: the five faces, told apart ----------------
console.log('\n— (b) part 4 · the Sovereign\'s room: caps and walls speak carried names + level marks —');
const menu = A.boundaryFacesOf(band, resolve);
const names = menu.map((e) => e.label);
check(
  '(b1) the caps read the ratified strings EXACTLY: AB₀·AD₀·AE₀ and AB₁·AD₁·AE₁',
  names.includes('AB₀·AD₀·AE₀ · 3 corners') && names.includes('AB₁·AD₁·AE₁ · 3 corners'),
  names.filter((n) => n.includes('3 corners')).join(' | '),
);
const walls = names.filter((n) => n.includes('4 corners'));
check(
  '(b2) the three walls each carry BOTH levels (₀ and ₁ inside one face — why the mark is per-corner, never per-face)',
  walls.length === 3 && walls.every((w) => w.includes('₀') && w.includes('₁')),
  walls.join(' | '),
);
check('(b3) all FIVE names are distinct — the Sovereign can tell the five faces apart', new Set(names).size === 5);
check(
  "(b4) `·` stays reserved for the corner join: no level ever prints as `·0`/`·1` (the mark is BOUND subscript)",
  names.every((n) => !/·\d/.test(n)),
);
check(
  '(b5) the wall AB₀·AD₀·AD₁·AB₁ realizes the mandate\'s own example; the second wall realizes as AB₀·AB₁·AE₁·AE₀ — the committed D14 rotation-to-earliest of the illustrative AE₀·AB₀·AB₁·AE₁ (same cycle, same sense, rotated)',
  names.includes('AB₀·AD₀·AD₁·AB₁ · 4 corners') && names.includes('AB₀·AB₁·AE₁·AE₀ · 4 corners'),
);

// ---- (c) presence-first: the ambo triangle is UNCHANGED --------------------
console.log('\n— (c) presence-first · the ambo triangle unchanged (lineage is walked on ABSENCE only) —');
check(
  '(c1) the ambo triangle still reads AB·AD·AE — no level mark, no lineage walk (its corners carry sources AND real labels; the labels win)',
  A.faceDisplayName(ambo, tri, resolve) === 'AB·AD·AE',
  A.faceDisplayName(ambo, tri, resolve),
);

// ---- (d) a genuinely unnamed source stays unnamed --------------------------
console.log('\n— (d) the honest absence survives · unnamed source ⇒ unnamed room face —');
{
  const bare = JSON.parse(JSON.stringify(lift));
  bare.vertices[tri.vertexIds[0]].data.label = ''; // a TRUE absence at the source
  const bareBand = thicken(bare, inlineSegment()).shape;
  const bareMenu = A.boundaryFacesOf(bareBand, resolverOver([bare]));
  const unnamedFaces = bareMenu.filter((e) => e.label.startsWith('unnamed')).length;
  check(
    '(d1) every face citing the absent-source corner reads `unnamed` (compose-over-absence: never a partial name); the untouched wall still resolves',
    unnamedFaces === 4 && bareMenu.some((e) => !e.label.startsWith('unnamed')),
    bareMenu.map((e) => e.label).join(' | '),
  );
}

// ---- (e) ⛔⛔ THE THREE NON-REGRESSION PINS --------------------------------
console.log('\n— (e) ⛔⛔ the three pins · manufactured labels STILL read `unnamed` (the scaffold holds) —');
{
  // e1 THE FOLD LOOP — the standing exhibit, on the real mint
  const segForLoop = liftSubComplex(createSeedShape('tetrahedron'), [{ kind: 'edge', id: createSeedShape('tetrahedron').edges[0].id }]).shape;
  const loop = closeSegmentIntoLoop(segForLoop, segForLoop.edges[0]).shape;
  const loopVs = Object.values(loop.vertices);
  const loopManufactured = loopVs.every((v) => (v.data?.label ?? '') === v.id);
  // the loop has no faces — its person surface is the argument card; the
  // scaffold CLASS is proven functionally on a planted face carrying the
  // loop's exact packet shape, WITH a live resolver and resolvable lineage
  const planted = {
    ...loop,
    vertices: Object.fromEntries(
      loopVs.map((v, k) => [
        v.id,
        { ...v, createdBy: { shapeId: loop.id, operation: 'product', sourceVertexIds: [lift.faces[0].vertexIds[k % 3]] } },
      ]),
    ),
    faces: [{ id: 'face:planted', vertexIds: loopVs.map((v) => v.id) }],
  };
  check(
    '(e1) THE FOLD LOOP: the real mint still writes id-as-label (measured) — and a face carrying exactly that packet shape reads `unnamed` even with a LIVE resolver and resolvable lineage (an id-copy is NEVER resolved — the migration discipline)',
    loopManufactured && A.faceDisplayName(planted, planted.faces[0], resolve) === 'unnamed',
    `loop labels manufactured: ${loopManufactured}`,
  );
  // e2 THE ZOO — a real body from the real mint, faces and all
  const zoo = buildClassBody({ kind: 'orientable', g: 1, b: 0, chi: 0, b1: 2 }, 'd12b-zoo');
  const zooFace = zoo.faces[0];
  const zooManufactured = zooFace.vertexIds.every((id) => (zoo.vertices[id]?.data?.label ?? '') === id);
  check(
    '(e2) THE ZOO BODY (standardBodies:130): its faces still read `unnamed` — with the live resolver handed in',
    zooManufactured && A.faceDisplayName(zoo, zooFace, resolve) === 'unnamed',
    `zoo face labels manufactured: ${zooManufactured}`,
  );
  // e3 THE MATERIALIZE MINT (materializeOperation:301) — source-pinned, and
  // its exact mint shape (id-copy + carried sources) planted through the
  // reader. Honest scope: the door's trace machinery is not driven here.
  const matSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/materializeOperation.ts'), 'utf8');
  const mintedId = 'site:d12b:planted';
  const mat = {
    ...loop,
    vertices: {
      [mintedId]: {
        id: mintedId,
        position: [0, 0, 0],
        data: { label: mintedId, color: '#fff', custom: {} },
        createdBy: { shapeId: 'shape:mat', operation: 'identify-sew', sourceVertexIds: [lift.faces[0].vertexIds[0]] },
      },
      b: { id: 'b', position: [1, 0, 0], data: { label: 'B', color: '#fff', custom: {} }, createdBy: { shapeId: 'shape:mat', operation: 'seed', sourceVertexIds: [] } },
      c: { id: 'c', position: [0, 1, 0], data: { label: 'C', color: '#fff', custom: {} }, createdBy: { shapeId: 'shape:mat', operation: 'seed', sourceVertexIds: [] } },
    },
    faces: [{ id: 'face:mat', vertexIds: [mintedId, 'b', 'c'] }],
  };
  check(
    '(e3) THE MATERIALIZE MINT: `createDefaultVertexData(mintedId)` still stands at its source (the migration has not reached it) AND its exact mint shape reads `unnamed` through the reader — one manufactured corner poisons no partial name',
    matSrc.includes('data: createDefaultVertexData(mintedId)') && A.faceDisplayName(mat, mat.faces[0], resolve) === 'unnamed',
  );
}

// ---- (f) the scaffold + the held file --------------------------------------
console.log('\n— (f) part 2 HELD · the scaffold stands, recorded positively; the card\'s file untouched —');
const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
check(
  '(f1) the scaffold clause STANDS in faceDisplayName, and its comment records: SCAFFOLD · thicken CURED · the migration shape · the DEATH-CONDITION (terminal cut after the last person-reachable manufacturer)',
  modelSrc.includes('trimmed === vertexId') &&
    modelSrc.includes('THE SCAFFOLD') &&
    modelSrc.includes('DEATH-CONDITION') &&
    modelSrc.includes('`thicken.ts:175` is CURED'),
);
const headArg = execFileSync('git', ['show', 'HEAD:src/manuscript/argumentReadingModel.ts'], { cwd: repoRoot, encoding: 'utf8' });
const workArg = fs.readFileSync(path.join(repoRoot, 'src/manuscript/argumentReadingModel.ts'), 'utf8');
check(
  '(f2) argumentReadingModel.ts is BYTE-UNCHANGED vs HEAD (its clause is part of the HELD part 2 — the card and the menu keep agreeing through the same scaffold law)',
  headArg.replace(/\r/g, '') === workArg.replace(/\r/g, ''),
);

// ---- (g) the view plumbing pins -------------------------------------------
console.log('\n— (g) the door\'s wiring —');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check(
  '(g1) the view hands the page resolver to the menu: resolveAbsentLabel (agreement law — labels.size === 1, never a pick) into boundaryFacesOf(apertureVolume, …)',
  viewSrc.includes('const resolveAbsentLabel') &&
    viewSrc.includes('boundaryFacesOf(apertureVolume, resolveAbsentLabel)') &&
    viewSrc.includes('labels.size === 1'),
);
check(
  '(g2) the level mark is read from the copy id\'s own `@k` tail (the mint\'s structural record) — multi-digit sane: a planted `@10` corner marks ₁₀',
  (() => {
    const shape = {
      ...band,
      vertices: {
        'x@10': { id: 'x@10', position: [0, 0, 0], data: { label: '', color: '#fff', custom: {} }, createdBy: { shapeId: 's', operation: 'product', sourceVertexIds: [lift.faces[0].vertexIds[0]] } },
        y: { id: 'y', position: [1, 0, 0], data: { label: 'Q', color: '#fff', custom: {} }, createdBy: { shapeId: 's', operation: 'seed', sourceVertexIds: [] } },
        z: { id: 'z', position: [0, 1, 0], data: { label: 'R', color: '#fff', custom: {} }, createdBy: { shapeId: 's', operation: 'seed', sourceVertexIds: [] } },
      },
      faces: [{ id: 'f', vertexIds: ['x@10', 'y', 'z'] }],
    };
    return A.faceDisplayName(shape, shape.faces[0], resolve).includes('₁₀');
  })(),
);

// ═════ THE RUNNING APP — the person's route ═════════════════════════════════
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-d12b-'));
  const liftFile = path.join(dir, 'lift.snapshot.json');
  fs.writeFileSync(liftFile, JSON.stringify(serializeSnapshot(lift, ambo.id, [ambo, cube])));
  const server = spawn(`npm run dev -- --port ${PORT} --strictPort`, { cwd: repoRoot, stdio: 'ignore', shell: true });
  let verdict = null;
  try {
    const up = await new Promise((resolve) => {
      const started = Date.now();
      const poll = () => {
        const r = http.get(`http://localhost:${PORT}/`, (res) => {
          res.resume();
          if (res.statusCode === 200) resolve(true);
          else next();
        });
        r.on('error', next);
        r.setTimeout(2000, () => {
          r.destroy();
          next();
        });
      };
      const next = () => (Date.now() - started > 90000 ? resolve(false) : setTimeout(poll, 600));
      poll();
    });
    check('\n§0 the committed dev app boots', up);
    if (up) {
      let out = '';
      try {
        out = execFileSync('python', [path.join(__dirname, 'd12b_carried_names_driver.py'), '--url', URL, '--lift', liftFile], {
          encoding: 'utf8',
          timeout: 720000,
        });
      } catch (error) {
        out = `${error.stdout ?? ''}`;
        if (!out.trim()) check('§0 the driver ran', false, String(error.message).slice(0, 160));
      }
      try {
        verdict = JSON.parse(out.trim().split(/\r?\n/).pop() ?? '');
      } catch {
        check('§0 the driver emitted a verdict', false, (out.trim().split(/\r?\n/).pop() ?? '').slice(0, 160));
      }
    }
    if (verdict) {
      const clause = (k, label) => {
        const v = verdict.results[k] ?? { ok: false, detail: 'clause missing' };
        check(label, v.ok, v.detail);
      };
      console.log('\n— the RUNNING app: the Sovereign\'s route, shelf-namespaced —');
      if (verdict.results['debug.meshes']) console.log(`  [debug meshes] ${verdict.results['debug.meshes'].detail}`);
      clause('route.liftPlace', 'the labeled lift parcel places (file door + drag)');
      clause('route.invoke', 'a Segment is INVOKED at the palette (the person\'s own door)');
      clause('route.thicken', 'the real thicken runs on (placed lift × invoked segment)');
      clause('route.bandPlace', 'the band parcel rides the shelf and places (auto-points)');
      clause('route.door', 'the door opens on the pointed-at band');
      clause('route.caps', '★ the LIVE menu speaks the ratified caps — AB₀·AD₀·AE₀ and AB₁·AD₁·AE₁ (the suffix layer of the resolver exercised by the shelf namespacing itself)');
      clause('route.fiveNamed', '★ all five options are named and distinct — no `unnamed`, no id leak, on the person\'s own screen');
      clause('hygiene.console', 'no console error across the drive');
    } else {
      failures += 1;
    }
  } finally {
    try {
      if (process.platform === 'win32') execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
      else process.kill(-server.pid, 'SIGKILL');
    } catch {
      /* gone */
    }
  }
  console.log(failures === 0 ? '\nDIAGNOSE-D12B-CARRIED-NAMES: ALL GREEN' : `\nDIAGNOSE-D12B-CARRIED-NAMES: ${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})();

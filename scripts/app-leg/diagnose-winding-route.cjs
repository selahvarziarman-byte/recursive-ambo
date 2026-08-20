#!/usr/bin/env node

// DIAGNOSTIC — THE WINDING ROUTE, STANDING (engineer 1230/1300 charter):
// the deterministic live sessions of the return line, driven nightly-able.
//
// ★ WHY THE DRIVE STANDS (the amendment's coupling, answered): the
// acceptance surface is a HAND walk — and hands do not run nightly. This
// drive is the only thing that catches a SILENT break of the return line
// (the seam, the caption element, the deck frame, the announce law). It
// keeps `seam.paceOverride` employed — the throttle exists because the
// software renderer's setTimeout starvation makes pulse lengths jitter
// 0.65–2.8 u at the person's pace; a 60 fps hand samples every ~0.07 u for
// free. Drop this witness and the seam goes with it (the engineer's rule:
// keep both or neither).
//
// THE THREE SESSIONS (all deterministic under the throttle):
//   cone   · the POSITIVE CONTROL — `2 doors · the room came back turned`
//            on the amendment-10 cone room (word d+0,d+0,d+0, built through
//            the aperture door) + the RETRACE on the same room —
//            `2 doors · the same way up` with a half-circle head-turn
//            between the crossings (the deck falsifier);
//   fan2   · the pillar CIRCUIT on the 5-cell fan chamber — the person
//            winds 300° around the k=5 cone edge and the room reads
//            `0 doors · the same way up` (THE INTERIOR-TRANSPORT GAP on the
//            person's own surface; when its cure lands, this reading is
//            re-derived — see diagnose-winding-headings' pinned trigger);
//   mirror · THE FOURTH STRING — the sweep's corrected fact, live: the
//            sound word d+0,d+1,d+2 returns the entry on a straight +y walk
//            in ONE door with a reflection deck ⇒
//            `1 doors · the room came back mirrored`.
//
// Run directly (boots vite on the leg's own port):
//   node scripts/app-leg/diagnose-winding-route.cjs

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
const { liftSubComplex } = req('src/lib/subComplexLift.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');

// the fan pillar circuit (derived + verified in diagnose-winding-headings)
const FAN_PLAN = [
  [-0.35, -0.55, 0.1],
  [0.78, -0.45, 0.1],
  [0.68, -0.2, 0.1],
  [0.43, -0.1, 0.1],
  [0.18, -0.2, 0.1],
  [0.08, -0.45, 0.1],
  [0.18, -0.7, 0.1],
  [0.43, -0.8, 0.1],
  [0.68, -0.7, 0.1],
  [0.78, -0.45, 0.1],
  [-0.35, -0.55, 0.1],
];

// ---- parcels (the committed mints; the file door is the person's own) ------
const seed = createSeedShape('cube');
const ambo = applyAmboDissection(seed);
const cubocta = ambo.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(ambo, cubocta.id);
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;
const lift = openLift(terrain, mid, coreCell.id);
const tetra = createSeedShape('tetrahedron');
const segLift = liftSubComplex(tetra, [{ kind: 'edge', id: tetra.edges[0].id }]);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-windroute-'));
const writeParcel = (name, file) => {
  const p = path.join(dir, name);
  fs.writeFileSync(p, JSON.stringify(file));
  return p;
};
const cubeFile = writeParcel('cube.snapshot.json', serializeSnapshot(createSeedShape('cube'), 'wind-cube'));
const fanFile = writeParcel('fanlift.snapshot.json', serializeSnapshot(lift.shape, terrain.id, [terrain, ambo, seed]));
const segFile = writeParcel('segment.snapshot.json', serializeSnapshot(segLift.shape, tetra.id, [tetra]));

function waitHttp(url, timeoutMs) {
  const started = Date.now();
  return new Promise((resolve) => {
    const poll = () => {
      const r = http.get(url, (res) => {
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
    const next = () => (Date.now() - started > timeoutMs ? resolve(false) : setTimeout(poll, 600));
    poll();
  });
}

(async () => {
  console.log(
    'THE WINDING ROUTE, STANDING — the deterministic readings on the person\'s own walk.\n' +
      'I drive the app from the shelf/palette/door on; I supplied the input parcels (committed mints, the file door).\n',
  );
  const server = spawn(`npm run dev -- --port ${PORT} --strictPort`, { cwd: repoRoot, stdio: 'ignore', shell: true });
  const verdict = { results: {} };
  try {
    const up = await waitHttp(`http://localhost:${PORT}/`, 90000);
    check('§0 the committed dev app boots', up);
    if (up) {
      for (const session of ['cone', 'fan2', 'mirror']) {
        let out = '';
        let errText = '';
        try {
          out = execFileSync(
            'python',
            [
              path.join(__dirname, 'winding_route_driver.py'),
              '--url', URL,
              '--session', session,
              '--cube', cubeFile,
              '--fanlift', fanFile,
              '--segment', segFile,
              '--arc', JSON.stringify(FAN_PLAN),
            ],
            { encoding: 'utf8', timeout: 600000 },
          );
        } catch (error) {
          out = `${error.stdout ?? ''}`;
          errText = `${error.stderr ?? ''}`;
          if (!out.trim()) {
            check(`§0 session ${session} ran`, false, `${String(error.message).slice(0, 90)} · ${errText.trim().split(/\r?\n/).slice(-2).join(' | ').slice(0, 140)}`);
            continue;
          }
        }
        try {
          Object.assign(verdict.results, JSON.parse(out.trim().split(/\r?\n/).pop() ?? '').results);
        } catch {
          check(`§0 session ${session} emitted a verdict`, false, (out.trim().split(/\r?\n/).pop() ?? '').slice(0, 120));
        }
      }
    }
    const clause = (k, label) => {
      const v = verdict.results[k] ?? { ok: false, detail: 'clause missing' };
      check(label, v.ok, v.detail);
    };
    console.log('\n— the cone room: the positive control + the retrace —');
    clause('C.cubePlaced', 'the cube parcel places');
    clause('C.picks', 'the aperture picks: the cone word d+0,d+0,d+0');
    clause('C.window', 'the room builds, summons, opens');
    clause('C.turned', '★★ `back where you started · 2 doors · the room came back turned` — seam + DOM');
    clause('B2.retrace', '★ the retrace with a head-turn: `2 doors · the same way up` — the deck falsifier');
    console.log('\n— the fan chamber: the interior-transport gap —');
    clause('E.parcels', 'the fan lift + segment place');
    clause('E.armed', 'the thicken pair arms');
    clause('E.window', 'EXIT B builds the chamber; the window opens');
    clause('E.circuit', '★ the pillar ENCIRCLED: `0 doors · the same way up` (the gap, on the person\'s surface)');
    console.log('\n— the mirrored room: the fourth string —');
    clause('M.cubePlaced', 'the cube parcel places');
    clause('M.picks', 'the aperture picks: the word d+0,d+1,d+2');
    clause('M.window', 'the room builds, summons, opens');
    clause('M.mirrored', '★★ `back where you started · 1 doors · the room came back mirrored` — live');
    clause('hygiene.console', 'no console error across the sessions');
  } finally {
    try {
      if (process.platform === 'win32') execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
      else process.kill(-server.pid, 'SIGKILL');
    } catch {
      /* gone */
    }
  }
  console.log(failures === 0 ? '\nDIAGNOSE-WINDING-ROUTE: ALL GREEN' : `\nDIAGNOSE-WINDING-ROUTE: ${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})();

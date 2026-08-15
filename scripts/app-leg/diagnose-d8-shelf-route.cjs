#!/usr/bin/env node

// DIAGNOSTIC — D8+D9+D10 (2026-08-15 engineer 1629): THE SHELF-ROUTE WITNESS.
//
// ★★ WHY THIS LEG EXISTS (the mandate's own words): diagnose-d2-one-door was
// ALL GREEN — and wrong — "because it handed in the product while the person
// drags a shelf parcel." So this witness traverses THE PERSON'S ROUTE on the
// RUNNING app: thicken (the real chip on two placed forms) → the band parcel
// rides the shelf channel → dragged onto paper → POINTED AT → EXIT B → the
// caption reads `cone edges (measured): …` — THE POSITIVE FACT (the
// acceptance fence: "no room reads UNRESOLVED any more" is D9's shadow and
// is NOT the acceptance).
//
// ★ THE CARRY DECLARATION (binding, per the mandate): the route is driven
// from the shelf onward — the thicken chip, the shelf drain, the drag-drop,
// the pointing, both exits are the app's own gestures. WHAT I SUPPLIED FOR
// MYSELF: the three INPUT parcels (a cube seed, the terrain-fan open-lift,
// an edge-lift segment) are minted OUTSIDE the window through the committed
// doors (createSeedShape / openLift / liftSubComplex / serializeSnapshot —
// the same calls the app's own store makes) and enter through the person's
// own FILE door. The in-app ambo → pyritohedral → open-lift GESTURES are
// not driven here; the door under test begins at the shelf.
//
// Clauses judged off the driver's JSON verdict:
//   d8.exitB.measured  ★ THE ACCEPTANCE — the person's room, built through
//                        the door, reads `cone edges (measured)`;
//   d8.exitA.measured    (a) the glued room reads measured too;
//   d9.noRoomAtThicken ★ (b) after D9 NO room exists at thicken — the band
//                        count is unchanged until the person answers;
//   d10.rows{3,7,25}.*   (c) the panel MEASURED at 3 / 7 / synthetic-25:
//                        no overlap with the sources shelf, exits inside the
//                        viewport, more-indicator honest both ways;
//   hygiene.console      no console error across the whole drive.
// Clause (d) — diagnose-d1-metric-thread still green — runs OUTSIDE this
// leg (its own file, same tree).
//
// Placed in scripts/app-leg/ (the non-suite home) — the flat 112-glob
// untouched. Run directly:
//   node scripts/app-leg/diagnose-d8-shelf-route.cjs

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

// ---- mint the three INPUT parcels through the committed doors --------------
function mintParcels() {
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
  const { applyPyritohedralDiagonalization } = req('src/lib/pyritohedralDiagonalization.ts');
  const { openLift } = req('src/lib/openLift.ts');
  const { liftSubComplex } = req('src/lib/subComplexLift.ts');
  const { serializeSnapshot } = req('src/playground/snapshot.ts');

  // (1) the terrain-fan OPEN-LIFT — the D8 base: the thicken product's
  // `product.parents` will name THIS shape, and it stands placed on the page
  const seed = createSeedShape('cube');
  const cube1 = applyAmboDissection(seed);
  const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
  const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);
  const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
  const mid = Object.values(terrain.vertices).find(
    (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
  ).id;
  const lift = openLift(terrain, mid, coreCell.id);

  // (2) the SEGMENT — a SINGLE seed-tetra edge lifted (probed: 2 v · 1 e ·
  // two free ends, segmentGateReason null). ⚠ an AMBO coarse edge is NOT a
  // segment — its grain lifts as the subdivided pair closed by the medial
  // (3 v · 3 e · 0 free ends, a loop) and Q1 refuses it; found by this leg's
  // own panel-refusal capture.
  const tetra = createSeedShape('tetrahedron');
  const segLift = liftSubComplex(tetra, [{ kind: 'edge', id: tetra.edges[0].id }]);

  // (3) the CUBE — the 3-row degenerate case for the D10 measurement
  const cube = createSeedShape('cube');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-d8-'));
  const writeParcel = (name, file) => {
    const p = path.join(dir, name);
    fs.writeFileSync(p, JSON.stringify(file));
    return p;
  };
  return {
    fanlift: writeParcel('fanlift.snapshot.json', serializeSnapshot(lift.shape, terrain.id, [terrain, cube1, seed])),
    segment: writeParcel('segment.snapshot.json', serializeSnapshot(segLift.shape, tetra.id, [tetra])),
    cube: writeParcel('cube.snapshot.json', serializeSnapshot(cube, 'd8-cube')),
    liftShapeId: lift.shape.id,
  };
}

function waitHttp(url, timeoutMs) {
  const started = Date.now();
  return new Promise((resolve) => {
    const poll = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode === 200) resolve(true);
        else next();
      });
      req.on('error', next);
      req.setTimeout(2000, () => {
        req.destroy();
        next();
      });
    };
    const next = () => {
      if (Date.now() - started > timeoutMs) resolve(false);
      else setTimeout(poll, 600);
    };
    poll();
  });
}

function killTree(pid) {
  try {
    if (process.platform === 'win32') {
      execFileSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    // already gone
  }
}

(async () => {
  console.log('THE D8 SHELF-ROUTE WITNESS — thicken → shelf → paper → point → both exits, on the RUNNING app');
  console.log(
    'I drive the person\'s route from the shelf on (thicken chip, shelf drain, drag-drop, pointing, exits);\n' +
      'I SUPPLIED the three input parcels (cube / terrain-fan open-lift / edge-lift segment), minted through\n' +
      'the committed doors and entering through the person\'s own FILE door. The in-app ambo → pyritohedral →\n' +
      'open-lift gestures are NOT driven here — the door under test begins at the shelf.\n',
  );
  const parcels = mintParcels();
  const server = spawn(`npm run dev -- --port ${PORT} --strictPort`, {
    cwd: repoRoot,
    stdio: 'ignore',
    shell: true,
  });
  let verdict = null;
  try {
    const up = await waitHttp(`http://localhost:${PORT}/`, 90000);
    check('§0 the committed dev app boots (vite, strict port — no stub, no stand-in)', up);
    if (up) {
      let out = '';
      try {
        out = execFileSync(
          'python',
          [
            path.join(__dirname, 'd8_shelf_route_driver.py'),
            '--url',
            URL,
            '--cube',
            parcels.cube,
            '--fanlift',
            parcels.fanlift,
            '--segment',
            parcels.segment,
          ],
          { encoding: 'utf8', timeout: 720000 },
        );
      } catch (error) {
        out = `${error.stdout ?? ''}`;
        if (!out.trim()) {
          check('§0 the driver ran (playwright reachable)', false, String(error.message).slice(0, 200));
        }
      }
      const lastLine = out.trim().split(/\r?\n/).pop() ?? '';
      try {
        verdict = JSON.parse(lastLine);
      } catch {
        check('§0 the driver emitted a verdict', false, lastLine.slice(0, 200));
      }
    }
    if (verdict) {
      const r = verdict.results;
      const get = (k) => r[k] ?? { ok: false, detail: 'clause missing from the driver verdict' };
      const clause = (k, label) => {
        const v = get(k);
        check(label, v.ok, v.detail);
      };
      console.log('\n— the route in (the person\'s own doors) —');
      clause('cube.place', 'the cube parcel places (file door + drag — the committed gesture)');
      clause('fan.liftPlace', 'the terrain-fan open-lift parcel places (THE BASE, standing on the page)');
      clause('fan.segmentPlace', 'the segment parcel places (last — its drop auto-selects it)');
      clause('fan.thickenChip', 'the dock thicken chip is present');
      clause('fan.liftMesh', 'the fan body located via the committed scene seam (the aimed shift-click)');
      clause('fan.thickenPanel', 'SHIFT-click arms the pair; the thicken panel reads the roles');
      clause('fan.thickenRun', 'the thicken action runs (the real store, the real product record)');
      console.log('\n— (b) ⛔ D9: NO un-asked-for room —');
      clause('d9.noRoomAtThicken', '★ (b) NO room exists at thicken — the room count is unchanged until the person answers the door');
      clause('d9.doorNotice', 'the door-open notice is spoken instead (flagged copy)');
      clause('d9.bandParcel', 'the band parcel arrived on the shelf (the store\'s own channel, drained by the view)');
      console.log('\n— D8: the door on the placed band —');
      clause('d8.bandPlace', 'the band parcel placed on paper (the person\'s drag; the drop auto-points)');
      clause('d8.door', 'the door opens on the pointed-at band');
      console.log('\n— ★★ THE ACCEPTANCE (the positive fact) —');
      clause('d8.exitB.measured', '★★ EXIT B: the person\'s room, built through the door, reads `cone edges (measured)`');
      clause('d8.exitA.pair', '(a) a boundary pair with a PRESERVING map found via the row\'s own menu');
      clause('d8.exitA.glueOffered', '(a) the glue exit is offered on the completed pair');
      clause('d8.exitA.measured', '(a) EXIT A: the glued room reads `cone edges (measured)` too');
      const info = get('d8.info.unresolved');
      console.log(`  ${info.detail}`);
      console.log('\n— (c) D10: the panel MEASURED at 3 / 7 / synthetic-25 rows —');
      for (const key of ['rows3', 'rows7', 'rows25']) {
        clause(`d10.${key}.rows`, `${key}: the row count is the derived one`);
        clause(`d10.${key}.noOverlap`, `${key}: the panel does NOT overlap the sources shelf (measured boxes)`);
        clause(`d10.${key}.exitsReachable`, `${key}: EXIT A/B sit inside the viewport — reachable with no untold gesture`);
        clause(`d10.${key}.moreIndicator`, `${key}: the more-indicator is honest both ways (present IFF the region overflows)`);
      }
      clause('synthetic.place', 'the seamed page places the cube (the seam pads ROWS, never the menu)');
      clause('synthetic.door', 'the door opens on the seamed page');
      clause('hygiene.console', 'no console error across the whole drive');
    } else {
      failures += 1;
    }
  } finally {
    killTree(server.pid);
  }
  console.log(failures === 0 ? '\nDIAGNOSE-D8-SHELF-ROUTE: ALL GREEN' : `\nDIAGNOSE-D8-SHELF-ROUTE: ${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})();

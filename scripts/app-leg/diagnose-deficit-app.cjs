#!/usr/bin/env node

// THE APP-PATH WITNESS LEG (SEAL_APP_PATH_WITNESS_LEG) — drive the REAL
// running dev app end-to-end and assert EXISTENCE mechanically:
//   E1 ★★ PRESENCE — the deficit register's group rides UNDER the faithful
//        frame in the LIVE scene graph (the exact mount R1 re-opened on);
//   E2 ★★ SEALED TEXT — the LIVE specimen card reads the sealed strings
//        (triangle: cone 300° + rim 60° · square: cone 270° + rim 90°);
//        text is trusted ONLY beside presence (the mothership's clause — a
//        hardcoded string cannot fake the mount);
//   E4    HYGIENE — no console error across the whole gesture drive.
//   E-LIFT ★★ (SEAL_THE_LIFT_IDENTITY_AND_GRAIN + SLICE2) — three REAL lift
//        parcels (two DIFFERENT edges + the coarse face) through the person's
//        own file door: ALL place (the distinct id — the dedup collision
//        dead), the LIVE card reads the real identity + life-line, and the
//        face card reads lifted-whole with NO mark (the interior CARRIED).
//
// ARCHITECTURE (the seal's ruling): a SEPARATE leg OUTSIDE the browserless
// 109-suite, run per render-arc handback. ⚠ PLACEMENT (disclosed finding):
// the suite convention collects `scripts/diagnose-*.cjs` by flat glob, so the
// SEALED basename would have joined the suite it is sealed to stay out of —
// this leg keeps the basename but lives under `scripts/app-leg/`, which the
// flat glob does not reach. Run it directly:
//   node scripts/app-leg/diagnose-deficit-app.cjs
//
// The leg BOOTS the committed dev app itself (vite, a strict private port),
// drives the person's own gestures via the Playwright driver sibling
// (deficit_app_driver.py — python + playwright, the sanctioned toolkit), and
// judges the sealed clauses off the driver's JSON verdict. NO stubs; the app
// is the committed tree's own dev server.

const { spawn, execFileSync } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const repoRoot = path.resolve(__dirname, '..', '..');
const PORT = 5199;
const URL = `http://localhost:${PORT}/?manuscript`;

// THE LIFT (SEAL_THE_LIFT_IDENTITY_AND_GRAIN): mint three REAL lift parcels
// through the committed doors (seed → ambo-dissection → liftSubComplex →
// serializeSnapshot) — two DIFFERENT edges (the distinct-id cure: both must
// place) + the coarse face (its card carries the honest grain mark). The
// driver feeds them through the person's own file door.
function mintLiftParcels() {
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
  const { getOperation } = req('src/operations/registry.ts');
  const { liftSubComplex } = req('src/lib/subComplexLift.ts');
  const { serializeSnapshot } = req('src/playground/snapshot.ts');
  const seed = createSeedShape('tetrahedron');
  const ambo = getOperation('ambo-dissection').execute({ shape: seed, selectedCellId: null, selectedCell: null });
  const edgeBetween = (u, v) =>
    ambo.edges.find(
      (e) => (e.vertexIds[0] === u && e.vertexIds[1] === v) || (e.vertexIds[0] === v && e.vertexIds[1] === u),
    );
  const eAC = edgeBetween('vertex:tetrahedron:a', 'vertex:tetrahedron:c');
  const eBD = edgeBetween('vertex:tetrahedron:b', 'vertex:tetrahedron:d');
  const coarseFace = ambo.faces.find(
    (f) => f.role === 'parent-cell-face' && f.vertexIds.every((v) => seed.vertices[v]),
  );
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-lift-'));
  const files = [
    ['ac.snapshot.json', liftSubComplex(ambo, [{ kind: 'edge', id: eAC.id }])],
    ['bd.snapshot.json', liftSubComplex(ambo, [{ kind: 'edge', id: eBD.id }])],
    ['face.snapshot.json', liftSubComplex(ambo, [{ kind: 'face', id: coarseFace.id }])],
  ].map(([name, lifted]) => {
    const file = path.join(dir, name);
    fs.writeFileSync(file, JSON.stringify(serializeSnapshot(lifted.shape, ambo.id, [])));
    return file;
  });
  return { dir, files };
}

let failures = 0;
function check(label, condition, detail) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (detail) console.log(`  ↳ ${detail}`);
  if (!condition) failures += 1;
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
  console.log('THE APP-PATH WITNESS LEG — presence + sealed text on the RUNNING app\n');
  const t0 = Date.now();
  const lift = mintLiftParcels();
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
      let driverExit = 0;
      try {
        out = execFileSync(
          'python',
          [path.join(__dirname, 'deficit_app_driver.py'), '--url', URL, '--lift-files', lift.files.join(',')],
          {
            encoding: 'utf8',
            timeout: 300000,
          },
        );
      } catch (error) {
        driverExit = typeof error.status === 'number' ? error.status : 1;
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
      if (verdict) {
        const r = verdict.results;
        const get = (k) => r[k] ?? { ok: false, detail: 'clause missing from the driver verdict' };
        check('§0 the app hooked its scene handle (the dev test seam is live)', get('boot').ok, get('boot').detail);
        for (const key of Object.keys(r)) {
          if (key.endsWith('.drive')) {
            check(`§0 the ${key.split('.')[0]} drive completed without an exception`, r[key].ok, r[key].detail);
          }
        }
        // E2 gestures + sealed text — the triangle specimen
        check('§E2 ★★ TRIANGLE — the person\'s own gestures run: an uncovered paper point → right-click → invoke → the fold chip → the panel → e0·e1 (one PRESERVING pair) → the committed preview accepts',
          get('triangle.paperPoint').ok && get('triangle.palette').ok && get('triangle.chip').ok && get('triangle.panel').ok && get('triangle.commitEnabled').ok);
        check('§E2 ★★ TRIANGLE — THE SEALED TEXT off the LIVE card: `cone point · deficit 300°` + `rim turn · 60°` (the card the person reads, not the model)',
          get('triangle.cardCone').ok && get('triangle.cardRim').ok);
        // E1 presence — the mount R1 re-opened on
        check('§E1 ★★ TRIANGLE — PRESENCE: the `deficit-register` group rides UNDER a `faithful-body` frame in the LIVE scene graph, with real mark children (the exact mount whose silent absence was the shipped defect)',
          get('triangle.presence').ok, get('triangle.presence').detail);
        // THE UNIFICATION (SEAL_FAITHFUL_BODY_UNIFICATION E6): the cone wears
        // the crafted stack on the LIVE app — lit MeshStandardMaterial meshes
        // (the body + the hull) inside the faithful frame; the wash was unlit
        check('§E-UNIFY ★ THE CONE WEARS THE CRAFTED STACK LIVE: the faithful frame carries the stack\'s fingerprint — ≥ 1 LIT MeshStandardMaterial mesh (the body; the old wash was pure unlit basic) AND ≥ 1 ShaderMaterial mesh (the key-light hatching) — measured against InkedForm\'s own material census (prepass + hull are basic by design)',
          (() => {
            try {
              const p = JSON.parse(get('triangle.presence').detail);
              return p.litMeshes >= 1 && p.hatchShaders >= 1;
            } catch {
              return false;
            }
          })(),
          get('triangle.presence').detail);
        check('§E2 ★★ SQUARE — gestures run and THE SEALED TEXT reads: `cone point · deficit 270°` + `rim turn · 90°`',
          get('square.palette').ok && get('square.chip').ok && get('square.panel').ok && get('square.commitEnabled').ok &&
            get('square.cardCone').ok && get('square.cardRim').ok);
        check('§E1 ★★ SQUARE — PRESENCE: after the second fold TWO faithful frames carry their deficit registers',
          get('square.presence').ok, get('square.presence').detail);
        // THE ARGUMENT CARD (Phases 1+2 — per SEAL_THE_ARGUMENT_CARD E7 / _PHASE2 E8)
        check('§E-CARD ★ THE ARGUMENT CARD RIDES THE LIVE APP: the MAP spine + INCIDENCE + STANCE + VERDICT sections, the demoted `certificate` receipt, AND the rim-turn local phrase (the SPLIT: the boundary bends — never "a cone") are all present on the fold-born\'s live card',
          get('card.mapSection').ok && get('card.incidence').ok && get('card.stance').ok && get('card.verdict').ok && get('card.certificate').ok && get('card.rimTurn').ok);
        check('§E-CARD THE SIGN HAND CARRIES ITS GLYPHS (Phase-2 signs included: ⊾ ⌐ ⇄ ○ Σδ, the grain ⚠): every card sign draws distinct from the notdef box in the same hand (a tofu sign is a BLANK CLAIM)',
          get('card.glyphs').ok, get('card.glyphs').detail);
        // THE LIFT (SEAL_THE_LIFT_IDENTITY_AND_GRAIN): real parcels through
        // the person's own file door, on the LIVE app
        check('§E-LIFT ★★ THE LIFT RIDES THE RUNNING APP: three REAL lift parcels (two DIFFERENT edges + the coarse face — committed doors, distinct ids) load through the person\'s own file door and ALL place on the sheet — the dedup admits BOTH edges (the collision that refused the second is dead) — and the LIVE card reads the REAL identity: "lifted from Ambo Dissection Tetrahedron" + the "seed corner of the tetrahedron, lifted" life-line + the midpoint\'s "ambo-dissection corner of" read-through',
          get('lift.load').ok && get('lift.bothEdgesPlaced').ok && get('lift.cardIdentity').ok,
          `${get('lift.bothEdgesPlaced').detail} · ${get('lift.cardIdentity').detail}`);
        check('§E-LIFT ★ THE FACE-CARRY RIDES LIVE (SLICE2): the face lift\'s card reads "lifted whole" with NO grain mark — the interior grain is CARRIED, and a mark would be a false claim',
          get('lift.cardFaceCarry').ok, get('lift.cardFaceCarry').detail);
        // PHASE D1 (SEAL_PHASE_D1_CORRESPONDENCE_ENGINE) — the engine live
        check('§E-D1 ★★ THE PICK RETURNS THE ENTITY ID + ONE ID-SPACE: hovering/clicking a specimen vertex at its OWN projected coords returns THAT vertex\'s live id (the lands-on-drawn proof — the projection and the pick agree); an edge likewise; every projected id === a card row resultId (the suffix-only plant REFUSED — D1 is ===, not endsWith)',
          get('corr.seam').ok && get('corr.pick').ok && get('corr.idSpace').ok,
          `${get('corr.pick').detail} · ${get('corr.idSpace').detail}`);
        check('§E-D1 ★ POSITIONS TRACK THE CAMERA + NO MARKS: the projected coords move on Reset and return onScreen after Fit Selected; the pick layer is INVISIBLE (every mesh opacity-0 — D1 renders nothing; the key/emphasis are D2\'s, held for the look-gate)',
          get('corr.track').ok && get('corr.noMarks').ok,
          `${get('corr.track').detail} · ${get('corr.noMarks').detail}`);
        // THE MARKED SPECIMEN (SEAL_THE_MARKED_SPECIMEN — THE CARD'S CLOSE):
        // M2 the callout ring + M1 register subordination — live
        check('§E-M2 ★★ THE RING CENSUS + HALO-EMPHASIS-ONLY + PERSISTENCE + TWO-REGISTER: every card row has ONE margin label (phantom 0, dropped 0 — the Phase-C law on the ring); the RECESSED ring wears NO paper halo (the 18-halo heap is deleted — the emphasis state alone gets paper); the key stood WITHOUT any hover (persistent on select), only the SELECTED specimen wears it, and deselect clears it',
          get('ring.census').ok && get('ring.haloDefaultZero').ok && get('d2.persistDeselect').ok,
          `${get('ring.census').detail} · ${get('ring.haloDefaultZero').detail} · ${get('d2.persistDeselect').detail}`);
        check('§E-M2 ★★ THE FIGURE IS VISIBLE + THE MARGIN IS RESERVED (the census-overlap-miss cure): NO key label box sits inside the figure\'s projected silhouette disc (L1), NO two leaders properly cross (L2 — each label holds its anchor\'s own bearing ray), and the FITTED figure occupies the non-margin fraction (L3 — the SPECIMEN_FIT_MARGIN reservation measured live). A heap that hides the figure goes RED here, headless',
          get('ring.figureVisible').ok && get('ring.marginReserved').ok,
          `${get('ring.figureVisible').detail} · ${get('ring.marginReserved').detail}`);
        check('§E-M2 ★ THE EMPHASIS IS BIDIRECTIONAL (~3) + THE PROMOTED HALO: hovering a specimen VERTEX lights its argument-neighborhood (~3, never 1, never all), bolds the matching CARD ROW, and the paper halo appears on EXACTLY the promoted marks; hovering an ENTITY card row lights the neighborhood and bolds the MARK — both directions on the one id-space',
          get('d2.emphasisEntitySide').ok && get('d2.emphasisRowSide').ok,
          `entity side: ${get('d2.emphasisEntitySide').detail} · row side: ${get('d2.emphasisRowSide').detail}`);
        check('§E-M1 ★★ REGISTER SUBORDINATION (one full · injective): cold, the door is CLOSED and ZERO annotation registers draw full (the binary recessed band holds; the DEFICIT rides as the researcher\'s STATED exception); the two recessed styles differ on FORM + factor + receded ink — no two registers collapse when recessed',
          get('regs.subordDefault').ok && get('regs.injective').ok,
          `${get('regs.subordDefault').detail} · ${get('regs.injective').detail}`);
        check('§E-M1 ★ THE FIELD DOOR + THE §7 PROMOTION: the door sits in the specimen panel CLOSED by default; opening promotes the field (full) and recedes the rest, closing returns the quiet band; touching a REGISTER row (the generators legend where loops exist · a deficit row · the door\'s own hover) promotes ITS register through the ONE emphasizedIds channel (`register:` ids — no new mechanism)',
          get('regs.doorClosedDefault').ok && get('regs.doorPromotesField').ok && get('regs.promoteCardRow').ok,
          `${get('regs.doorClosedDefault').detail} · ${get('regs.doorPromotesField').detail} · ${get('regs.promoteCardRow').detail}`);
        check('§E-M2 THE RESERVATION IS ONE CONSTANT + THE RECESSION IS WEIGHT+HUE (source-pinned): the ring exports SPECIMEN_FIT_MARGIN and the view\'s camera fit consumes THAT constant (the margin reserved BEFORE the figure is sized); the ring type is page-fixed (RING_FONT_PX); the halo styles ONLY the lit branch; the recessed band derives from designDefaults.registers (line factor ≠ stipple factor) with NO opacity/dash move; the deficit exception is STATED in InkedPlainForm',
          (() => {
            const ringSrc = fs.readFileSync(path.join(repoRoot, 'src/components/CorrespondenceRing.tsx'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const plainSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/InkedPlainForm.tsx'), 'utf8');
            const fieldSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/InkedFieldLayer.tsx'), 'utf8');
            const defaultsSrc = fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8');
            return (
              ringSrc.includes('export const SPECIMEN_FIT_MARGIN') &&
              ringSrc.includes('export const RING_FONT_PX') &&
              ringSrc.includes('...(lit') &&
              viewSrc.includes('fitMargin={SPECIMEN_FIT_MARGIN}') &&
              plainSrc.includes('recessedLineFactor') &&
              plainSrc.includes('STATED EXCEPTION') &&
              fieldSrc.includes('recessedStippleFactor') &&
              defaultsSrc.includes('recessedLineFactor') &&
              defaultsSrc.includes('recessedStippleFactor') &&
              !ringSrc.includes('strokeDasharray')
            );
          })());
        // PHASE A (SEAL_PHASE_A_CAMERA) — the plate on the RUNNING app
        check('§E-PLATE ★★ SELECT FRAMES THE SPECIMEN: after the drop\'s auto-select, the specimen\'s projected screen height is a LEGIBLE fraction of the frame (≥ 0.22 of the viewport — the designer measured ~50px ≈ 0.055 pre-cure), and the Fit Selected + Reset Camera controls stand in the chrome',
          get('camera.plate').ok && get('camera.controlsPresent').ok,
          get('camera.plate').detail);
        check('§E-FIT/RESET ★ THE RECOVERY CONTROLS FIRE: Reset returns the composed default camera EXACTLY (compared against the boot-captured state, never a guessed literal); Fit Selected re-flies the plate to a legible fraction',
          get('camera.fitReset').ok, get('camera.fitReset').detail);
        check('§E-ZOOM ★ ZOOM LANDS AT THE CURSOR WITH A USABLE DELTA: four wheel ticks with the cursor right-of-center pull the camera materially closer (≥12%) AND laterally toward the cursor — not the dead fixed-anchor crawl (~0.7%/tick, 34 ticks)',
          get('camera.zoomToCursor').ok, get('camera.zoomToCursor').detail);
        check('§E-PAN ★ MIDDLE-DRAG PANS: the framing translates (lateral shift, quaternion unchanged — a pan, not an orbit) and never opens the invoke palette',
          get('camera.pan').ok, get('camera.pan').detail);
        check('§E-NO-REGRESSION left-drag still ORBITS and the right-click invoke palette still opens — the pan/zoom bindings collide with neither',
          get('camera.noRegression').ok, get('camera.noRegression').detail);
        // THE D2 GROUND (SEAL_D2_GROUND_HATCH_PARITY) — live
        check('§E-HATCH ★★ THE D2 GROUND IS HATCHED: the placed flat lift\'s PLAIN body carries the hatch ShaderMaterial (grey from lines, the crafted key-light shading — not a fill wash); the material census reads it on the live written bodies',
          get('hatch.plain').ok, get('hatch.plain').detail);
        check('§E-RESIDUAL-ORBIT ★ THE DRAG KEEPS THE SUBJECT: an orbit-drag release does NOT deselect (the plate + the designer\'s two-angle look survive); a TRUE empty-paper click still deselects — the drag/click discriminator holds both ways',
          get('residual.orbitKeepsSelection').ok && get('residual.emptyClickDeselects').ok,
          `${get('residual.orbitKeepsSelection').detail} · ${get('residual.emptyClickDeselects').detail}`);
        check('§E-RESIDUAL-CHROME the CameraDock stands clear of the aperture toggle (bounding boxes disjoint — the bottom-right stack is gone)',
          get('residual.chromeDisjoint').ok, get('residual.chromeDisjoint').detail);
        // E4 hygiene
        check('§E4 CONSOLE CLEAN — no error logged across the whole drive (favicon noise excluded)',
          get('console').ok, get('console').detail);
        if (driverExit !== 0 && failures === 0) {
          check('§0 the driver exit agrees with the clauses', false, `driver exit ${driverExit}`);
        }
      }
    }
  } finally {
    killTree(server.pid);
    try {
      fs.rmSync(lift.dir, { recursive: true, force: true });
    } catch {
      // scratch parcels — best-effort cleanup
    }
  }
  if (failures > 0 && verdict) {
    // diagnostics on red: the driver's raw record ledger (honest evidence,
    // printed only when a clause failed)
    console.log(`\nDRIVER VERDICT (diagnostic): ${JSON.stringify(verdict.results)}`);
  }
  const seconds = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n  runtime: ${seconds}s (dev-boot + headless chromium — the disclosed cost; run per render-arc handback, never in the browserless suite)`);
  console.log(
    `\n--- THE APP-PATH WITNESS LEG (presence + sealed text, the mechanical rung under the designer's eye): ${
      failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
    } ---`,
  );
  console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
  process.exit(failures === 0 ? 0 : 1);
})();

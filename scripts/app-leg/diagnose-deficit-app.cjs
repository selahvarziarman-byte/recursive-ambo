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
            // RUNG 1 raised the drive's floor: the explore sections add the
            // doorway, a 7.6 s sustained walk (the crossing), and two
            // threshold room builds — the old 300 s ceiling truncated the run
            timeout: 480000,
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
        // M3 (SEAL_M3_PERSISTENCE — the feature's completion) — live
        check('§E-M3 ★★ THE MARKS SURVIVE THE OPERATION (the dropped-info cure): folding a marked shape births a FAITHFUL cone whose ring renders FROM ITS OWN CARD (census equal on the born) with concept labels MAPPED BY NAME from the pre-fold ring (never re-lettered) — measured on BOTH fold subjects',
          get('triangle.ringPersists').ok && get('square.ringPersists').ok,
          `triangle: ${get('triangle.ringPersists').detail} · square: ${get('square.ringPersists').detail}`);
        check('§E-M3 ★ GENERAL + MERGED + NO FALSE MEMORIAL: an INVOKED plain shape rings from its own card (no lift special-case); the fold-born merged class wears ONE `p ← {…}` label (its OWN name or \'unnamed\' — never an invented result-letter); died rows read 0 on the absorbing fold (the memorial speaks only a TRUE death)',
          get('triangle.ringGeneral').ok && get('square.ringGeneral').ok &&
            get('triangle.ringMerged').ok && get('square.ringMerged').ok &&
            get('triangle.diedRowAbsent').ok && get('square.diedRowAbsent').ok,
          `general: ${get('square.ringGeneral').detail} · merged: ${get('triangle.ringMerged').detail} · died: ${get('triangle.diedRowAbsent').detail}`);
        check('§E-M3 + CLEANUPS (source-pinned + live): the ring mount hosts plain/skeleton/FAITHFUL with the REPOSITIONED fan as the faithful anchor (representative-body modes excluded — their drawn id-space is not the form\'s; bodiless has no anchors); diedConceptRows carries the IDENTITIES with the count derived from the ONE filter, and the card renders the † memorial row; the co-bearing radial step derives 1.5×cap (capPx = 4h — the bare 22 is gone); the CameraDock sits bottom-LEFT, live-measured clear of the field door',
          (() => {
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/argumentReadingModel.ts'), 'utf8');
            const ringSrc = fs.readFileSync(path.join(repoRoot, 'src/components/CorrespondenceRing.tsx'), 'utf8');
            const chromeSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
            return (
              viewSrc.includes("render.mode === 'faithful'") &&
              viewSrc.includes('faithfulDeficitById.get(entry.form.id)') &&
              viewSrc.includes('data-died-row') &&
              viewSrc.includes("r.ownName ?? 'unnamed'") &&
              modelSrc.includes('diedConceptRows') &&
              modelSrc.includes('const diedConcepts = diedConceptRows.length') &&
              ringSrc.includes('const ringStackPx = 1.5 * capPx') &&
              !ringSrc.includes('RING_STACK_PX = 22') &&
              chromeSrc.includes("left: 14, bottom: 24") &&
              get('regs.dockClearOfDoor').ok
            );
          })(),
          get('regs.dockClearOfDoor').detail);
        // THE REFINED IDENTIFY GESTURE (SEAL_THE_IDENTIFY_GESTURE) — live
        check('§E-IDENTIFY ★★ THE TAIL IS A VERTEX YOU PICK + THE COMPUTED PREVIEW + THE FLIP + THE STATED COMMIT: the trace panel opens; a DISCRETE vertex target starts each edge (the click-proximity `du <= dv` inference is DELETED — source-pinned below); the preview names the surface by CALLING the frozen mode computation (band/twist + the per-pair counterfactual); RE-TAPPING the traced edge moves the tail and the computed word FLIPS (band↔twist — only a real computation flips); the commit label STATES the result and the commit lands',
          get('identify.panelOpens').ok && get('identify.previewComputed').ok && get('identify.flipFlipsPreview').ok && get('identify.commitStates').ok && get('identify.commitLands').ok,
          `${get('identify.previewComputed').detail} · ${get('identify.flipFlipsPreview').detail} · ${get('identify.commitStates').detail}`);
        check('§E-IDENTIFY THE GESTURE IS DISCRETE + PERSON-LANGUAGE + THE FROZEN BOUNDARY HELD (source-pinned): `du <= dv` is GONE from the view; the overlay carries named trace-tail vertex targets and the pick derives dir from the PICKED vertex; the preview memo CALLS modesFromDirectedCycles (a second call site beside the commit — reuse, never a reimplementation); no raw-visible "tails run with" causal story; the panel speaks band/twist (the old nothing-to-switch copy is gone); complexIdentification.ts byte-identity rides its FROZEN manifest row, enforced by diagnose-engine-freeze every suite run (this orchestrator deliberately does NOT name the manifest — it carries write APIs for the lift parcels, and the freeze grep-proof forbids that pairing)',
          (() => {
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            return (
              !viewSrc.includes('du <= dv') &&
              viewSrc.includes("name={`trace-tail:${edge.id}:${endKey}`}") &&
              viewSrc.includes("const dir: 1 | -1 = tail === 'u' ? 1 : -1;") &&
              (viewSrc.match(/modesFromDirectedCycles\(/g) ?? []).length >= 2 &&
              !viewSrc.includes('tails run') &&
              viewSrc.includes('tap the corner you start each edge from') &&
              !viewSrc.includes('there is nothing to switch') &&
              viewSrc.includes("'confirm — sew into a band'")
            );
          })(),
          'the discrete-gesture + frozen-boundary pins');
        // THE FIELD DOOR (SEAL_THE_FIELD_DOOR_AND_TEST_SPECIMENS) — live
        check('§E-FIELD ★ THE 3-STATE LAW + THE PERSON\'S LANGUAGE: the door-gated field is ABSENT when closed (field-layer census 0 — not drawn, not merely recessed) while the always-present registers stay RECESSED (deficit-register still drawn); opening puts the register FULL (the state law — the layer DRAWS iff the field PLATES, and no leg-reachable specimen\'s field plates at HEAD: finding #3, the drawn-when-plated law riding diagnose-the-field-in-the-specimen); re-closing returns ABSENT; the door copy is the designer\'s ruled person-language ("the field — show it" / "shown · other marks step back") with ZERO memo words ("recessed"/"promoted") on the page; with the door open the specimen holds FIELD-SLOT + DEFICIT + KEY together (the closest-to-four stand-up — generators are the b₁ gap, §14)',
          get('regs.fieldAbsentClosed').ok && get('regs.fieldShownOpen').ok && get('regs.doorCopy').ok && get('regs.threeRegisterTogether').ok &&
            (() => {
              const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
              const chromeSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
              return (
                (viewSrc.match(/promotedRegister === 'field' &&\s+specimenField/g) ?? []).length === 2 &&
                chromeSrc.includes("'— shown · other marks step back'") &&
                chromeSrc.includes("'— show it'") &&
                !chromeSrc.includes("'recessed — open to promote'")
              );
            })(),
          `${get('regs.fieldAbsentClosed').detail} · ${get('regs.fieldShownOpen').detail} · ${get('regs.doorCopy').detail} · ${get('regs.threeRegisterTogether').detail}`);
        // THE RING ANCHOR RESOLVER (SEAL_THE_RING_ANCHOR_RESOLVER) — live
        check('§E-RESOLVER ★★ THE RING RENDERS ON EVERY DRIVEABLE MODE (no silent bare): the TORUS and the CYLINDER (immersion — the two bodies measured BARE before the resolver) anchor their rings ON the surface with census === anchored and unplaced 0; the SKELETON (dock cut on the picked face) rings; plain (the invoked squares) and faithful (the fold-born cones) ride the earlier sections. classBody/bodiless have NO committed gesture producer (measured — the died precedent): their refusal branches are model-witnessed (diagnose-argument-card §13) and the card\'s open declaration is source-pinned below',
          get('ring.modeTorus').ok && get('ring.modeCylinder').ok && get('ring.modeSkeleton').ok,
          `${get('ring.modeTorus').detail} · ${get('ring.modeCylinder').detail} · ${get('ring.modeSkeleton').detail}`);
        check('§E-RESOLVER THE FLOOR IS COMPILE-TIME + THE CARD DECLARES (source-pinned): resolveRingAnchors carries the `: never` floor (deleting a mode branch cannot compile — the readDeficitForRender pattern), judges ALL SIX mode strings, the view consumes it for the mount AND the card declaration (data-ring-refusal + data-ring-unplaced), the seam mirrors the verdict (ringResolution), and the ring consumes resolver anchors (its own geometry resolution is gone)',
          (() => {
            const resolverSrc = fs.readFileSync(path.join(repoRoot, 'src/components/ringAnchorResolver.ts'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const ringSrc = fs.readFileSync(path.join(repoRoot, 'src/components/CorrespondenceRing.tsx'), 'utf8');
            return (
              resolverSrc.includes('function unhandledRingMode(render: never): never') &&
              ["'plain'", "'skeleton'", "'faithful'", "'immersion'", "'classBody'", "'bodiless'"].every((m) =>
                resolverSrc.includes(`render.mode === ${m}`)) &&
              resolverSrc.includes('DIHEDRAL_IMAGES') &&
              viewSrc.includes('resolveRingAnchors(entry.form, selectedArgument)') &&
              viewSrc.includes('data-ring-refusal') &&
              viewSrc.includes('data-ring-unplaced') &&
              viewSrc.includes('seam.ringResolution') &&
              ringSrc.includes('anchors: ReadonlyMap<string, Vec3>') &&
              !ringSrc.includes('shape.edges.find')
            );
          })());
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
        check('§E-RESIDUAL-ORBIT ★ THE DRAG KEEPS THE SUBJECT + ARMAN\'S DOUBLE-CLICK LAW (2026-08-07, his direct word): an orbit-drag release does NOT deselect; a SINGLE empty-paper click is INERT (no sink — the stray-tap reset animation is gone); the DOUBLE-CLICK dismisses; the drag/click discriminator still guards both. Source-pinned: the summon (pick) fires only at detail ≥ 2 (shift-click keeps the combine arm), both dismiss doors demand detail ≥ 2, the card hint reads double-click',
          get('residual.orbitKeepsSelection').ok && get('residual.emptyClickDeselects').ok &&
            (() => {
              const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
              return (
                viewSrc.includes('if (event.nativeEvent.detail >= 2) pick(id, false);') &&
                (viewSrc.match(/detail < 2\) return;/g) ?? []).length === 2 &&
                viewSrc.includes('esc · double-click paper')
              );
            })(),
          `${get('residual.orbitKeepsSelection').detail} · ${get('residual.emptyClickDeselects').detail}`);
        check('§E-RESIDUAL-CHROME the CameraDock stands clear of the aperture toggle (bounding boxes disjoint — the bottom-right stack is gone)',
          get('residual.chromeDisjoint').ok, get('residual.chromeDisjoint').detail);
        // RUNG 1 — THE EXPLORE WINDOW (FAT CHARTER 2026-08-07): the doorway,
        // the driveable eye, and the five invariants, on the RUNNING app
        check('§E-DOORWAY ★★ THE WINDOW OPENS FROM THE SHAPE AND THE SHELL STAYS OPERABLE: double-click summons T³, the dock\'s `explore inside` chip opens the titled window, the specimen card AND the Fit control still stand BEHIND it (the shell is the operable representative; the window is where the inside-truth lives)',
          get('explore.selectT3').ok && get('explore.chipPresent').ok && get('explore.doorwayOpens').ok && get('explore.shellOperableBehind').ok,
          `${get('explore.doorwayOpens').detail} · ${get('explore.shellOperableBehind').detail}`);
        check('§E-REST-RECURRENCE ★★ THE STANDING CORRIDOR ALREADY RECURS: the window\'s first walked frame counts ≥ 2 mask copies BEFORE any gesture (looks 0 · advances 0 at capture) — if it needed motion to read that the space repeats, it would go RED here (the designer\'s first and hardest gate)',
          get('explore.restRecurrence').ok, get('explore.restRecurrence').detail);
        check('§E-DRIVEABLE ★★ THE TWO GESTURES DRIVE THE EYE: a drag TURNS forward (the look), a sustained hold MOVES the eye along forward (the advance — a cloister pace, no strafe/roll/speed switch exists to pin), and the walked frames keep arriving through the worker',
          get('explore.lookTurns').ok && get('explore.advanceWalks').ok,
          `${get('explore.lookTurns').detail} · ${get('explore.advanceWalks').detail}`);
        check('§E-NO-CROSSING ★★ THE CARRY IS SEAMLESS, MEASURED: the sustained walk CROSSED a paired face (the eye carried back by the engine\'s own isometry) and the crossing frames\' image deltas sit INSIDE the ordinary walking-frame band (max crossed Δ ≤ 1.75 × max plain Δ + ε) — a wrong or marked transport explodes exactly here; no seam/flash element exists to draw (source-pinned below)',
          get('explore.noCrossingMark').ok, get('explore.noCrossingMark').detail);
        check('§E-HORIZON + E-CAPTION-COUNTABLE ★ THE LIMIT OF SIGHT IS NAMED AND THE CAPTION COUNTS: the live window caption carries the committed countable orbit (`orbit (visible): N masks` · the hands\' LEFT count) AND `copies shown to depth N`; the un-hit void is EXACTLY paper by the ink\'s own law (no black wall — apertureInk untouched, its witness standing)',
          get('explore.horizonCaption').ok, get('explore.horizonCaption').detail);
        check('§E-THRESHOLD-REFUSAL ★★ NON-E³ REFUSES AT THE DOOR, BY NAME: a person-built one-pair room (a bounded Euclidean cone-manifold, measured in grounding) and a FOLDED body (left~top d+1 — the orbifold) both refuse at the doorway with the reason (cone edges · fold loci) and the window NEVER mounts — the habitat opens or it doesn\'t (never a smear)',
          get('explore.coneRoomBuilt').ok && get('explore.thresholdRefusesCone').ok && get('explore.foldedBuilt').ok && get('explore.thresholdRefusesFolded').ok,
          `${get('explore.thresholdRefusesCone').detail} · ${get('explore.thresholdRefusesFolded').detail}`);
        check('§E-SHELL-INTACT ★★ CLOSE RETURNS TO THE UNHARMED SHELL + THE CARD DOORWAY + THE ESC LAW: closing the window leaves the SAME shell caption byte-equal, the selection held, and the Fit control live; the card\'s own doorway row re-opens the window; Esc closes the window ALONE (the selection survives — the shell is never falsified)',
          get('explore.shellIntactOnReturn').ok && get('explore.cardDoorPresent').ok && get('explore.cardDoorAndEsc').ok,
          `${get('explore.shellIntactOnReturn').detail} · ${get('explore.cardDoorAndEsc').detail}`);
        // THE INSIDE-VIEW HATCH (SEAL_THE_INSIDE_VIEW_HATCH) — grey from
        // LINES; §E-D1-MIDTONES is RETIRED (its fill-range bar demanded the
        // exact wash the designer reversed)
        check('§E-HATCH ★★ GREY FROM LINES, LIVE: the standing frame\'s mid-band pixels live as STROKES — ≥ 50% carry high 8-neighbour contrast (a stroke sits beside paper; a flat wash reads ~0 here) with a real mid presence (≥ 6%), measured on the EXACT bytes put to the canvas. The retired D1 fill bar demanded the opposite law',
          get('explore.greyFromLines').ok, get('explore.greyFromLines').detail);
        check('§E-HATCH ★ SURFACE-LOCKED + NIB + CHIRALITY + RESOLUTION-HELD + THE CONFORMAL SEAM (source-pinned): the screen-space fixed-angle families are GONE from the ink (no px·cosA phase); the hatch reads the trace\'s normal + objPos + facing channels (surface direction · surface phase · grazing density) and twists ±chiralityAngle by the copy\'s parity; the nib scales the contour by depth; the explore defaults carry the stroke dials (strokePitch/strokeFloor/crossOnset) with resolution UNCHANGED at 128 (D2 held); apertureModel\'s cone census reads the ONE seam (resolveConeAngleSource — measured via readPillarDihedrals + edgeClassOf when a dihedral-owning thicken product rides, k×90° otherwise) and the window wires the lineage lookup; apertureModel/apertureInk edits ride their OWN witnesses green (E-APERTURE-WITNESSED)',
          (() => {
            const defaultsSrc = fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const inkSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureInk.ts'), 'utf8');
            const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
            const exploreBlock = defaultsSrc.slice(defaultsSrc.indexOf('explore: {'), defaultsSrc.indexOf('junction: {'));
            return (
              !inkSrc.includes('px * cosA + py * sinA') &&
              inkSrc.includes('objPos') &&
              inkSrc.includes('facingBuf[idx]') &&
              inkSrc.includes('chiralityAngleDeg') &&
              inkSrc.includes('nibDepthScale * depth[idx]') &&
              modelSrc.includes('objPos[3 * idx] = p[0] + v[0] * best.t;') &&
              modelSrc.includes('export function resolveConeAngleSource') &&
              modelSrc.includes('readPillarDihedrals(lineage.base, shape)') &&
              modelSrc.includes('domain.complex.edgeClassOf(reading.pillarEdgeId)') &&
              modelSrc.includes('geometryFromTower(tower, resolveConeAngleSource(domain, lineage))') &&
              viewSrc.includes("model.shape.genealogy?.operation === 'product'") &&
              exploreBlock.includes('resolution: 128,') &&
              exploreBlock.includes("paperColor: '#e9e2cf',") &&
              exploreBlock.includes('strokePitch: 0.085,') &&
              exploreBlock.includes('strokeFloor: 0.12,') &&
              exploreBlock.includes('crossOnset: 0.55,') &&
              viewSrc.includes('strokePitch: exploreInkCtl.strokePitch,') &&
              (viewSrc.match(/toneGamma: apertureCtl\.toneGamma,/g) ?? []).length === 2
            );
          })(),
          'the surface-lock/nib/chirality/seam pins');
        check('§E-EXPLORE THE SUBSTRATE HOLDS ITS LAWS (source-pinned): the walk consumes the aperture\'s EXPORTED applyPoint/applyVector on the witnessed deck (the transport math is never re-derived — apertureModel byte-untouched rides its NOT_FROZEN row + diagnose-the-aperture); the window\'s opening frame IS the tracer\'s own default frame (both literals byte-equal in model and tracer); the threshold law is TOTAL (E³ opens · cone · folded · the surface\'s later-rung declaration · the greyed chip\'s word); the window is a thin hand (renderApertureInk + apertureCaption verbatim, no π₁/fundamental-group word anywhere in the new files); the worker rides the fieldWorker idiom (module URL + type module); the Esc guard closes the window FIRST',
          (() => {
            const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/exploreWindowModel.ts'), 'utf8');
            const windowSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
            const workerSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/exploreTraceWorker.ts'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const apertureSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
            return (
              /import \{[^}]*applyPoint,[^}]*applyVector,/.test(modelSrc.replace(/\r/g, '')) &&
              !/const\s+deckCompose|function\s+fitRigid|function\s+fitDeckIsometry/.test(modelSrc) &&
              modelSrc.includes('eye: [-0.38, -0.3, -0.05]') &&
              modelSrc.includes('forward: [0.8, 0.55, 0.12]') &&
              apertureSrc.includes('options.eye ?? [-0.38, -0.3, -0.05]') &&
              apertureSrc.includes('options.forward ?? [0.8, 0.55, 0.12]') &&
              modelSrc.includes("if (geometry.kind === 'E3') return { opens: true };") &&
              modelSrc.includes("if (geometry.kind === 'folded')") &&
              modelSrc.includes('EXPLORE_SURFACE_LATER') &&
              modelSrc.includes('EXPLORE_NEEDS_ROOM') &&
              viewSrc.includes('setExploreRefusal({ key: selected, reason: EXPLORE_SURFACE_LATER });') &&
              viewSrc.includes('data-explore-refusal') &&
              viewSrc.includes('if (exploreOpenRef.current) {') &&
              windowSrc.includes('renderApertureInk(trace, liveRef.current.ink)') &&
              windowSrc.includes('apertureCaption(liveRef.current.geometry, trace.counts)') &&
              windowSrc.includes('copies shown to depth') &&
              !/π₁|fundamental group/.test(modelSrc) &&
              !/π₁|fundamental group/.test(windowSrc) &&
              workerSrc.includes('traceAperture({') &&
              workerSrc.includes('trace.normal.buffer') &&
              viewSrc.includes("new Worker(new URL('./exploreTraceWorker.ts', import.meta.url), { type: 'module' })") &&
              !/minimap|you are here|orbit diagram/.test(windowSrc)
            );
          })(),
          'the walk/threshold/caption substrate pins');
        // E4 hygiene
        check('§E4 CONSOLE CLEAN — no error logged across the whole drive (favicon noise excluded)',
          get('console').ok, get('console').detail);
        if (driverExit !== 0 && failures === 0) {
          // NAME the orphan: a red record no clause consumes must not hide
          // behind a bare exit code (run 4's find — the caption capture)
          const reds = Object.entries(verdict.results ?? {})
            .filter(([, r]) => !r.ok)
            .map(([k, r]) => `${k}: ${r.detail}`)
            .join(' · ');
          check('§0 the driver exit agrees with the clauses', false, `driver exit ${driverExit} · red records: ${reds || 'none listed'}`);
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

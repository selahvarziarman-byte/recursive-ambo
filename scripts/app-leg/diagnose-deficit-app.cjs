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
            // RUNG 1 raised the drive's floor (doorway + sustained walk +
            // threshold builds pushed past 300 s); the GPU reset raised it
            // again — the 6 s advance hold + the CONE room build (six face
            // picks, three maps, glue, chip) measured 484.9 s wall against
            // the old 480 s ceiling. 720 s is the disclosed cost.
            timeout: 720000,
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
        check('§E-GPU ★★ THE SHADER IS UP AND THE LOOP LIVES (ADR 0004 Amdt 7 — the aperture is a PLACE): the window renders via a linked WebGL2 fragment shader (the CPU still is retired) and the render loop keeps producing frames',
          get('explore.gpuUp').ok, get('explore.gpuUp').detail);
        check('§E-DRIVEABLE ★★ THE TWO GESTURES DRIVE THE CARRIED FRAME: a drag TURNS forward (the look), a sustained hold MOVES the eye along it (the advance) — and the walk went THROUGH A DOOR (the transport carried the eye AND the frame; a mirror door may take the frame\'s handedness — the instrument\'s hard-won law, ported whole)',
          get('explore.lookTurns').ok && get('explore.advanceWalks').ok,
          `${get('explore.lookTurns').detail} · ${get('explore.advanceWalks').detail}`);
        check('§E-HORIZON ★ THE LIMIT OF SIGHT IS NAMED + THE FLAT ROOM SAYS SO (C5, Part A): the live window caption carries the deck\'s own geometry line, `copies shown to depth N`, AND — the T³ having no cone edges — the explicit reading `flat · no cone edges` (never silence); the void is PAPER by the shader\'s own law (no fog, no wall — the miss branch returns the page)',
          get('explore.horizonCaption').ok, get('explore.horizonCaption').detail);
        check('§E-DOOR-LAW ★★ THE BOUNDED BODY OPENS (the DOOR-FEED partial — the researcher\'s precedent: a LEGAL PARTIAL PAIRING is a room; its unpaired faces are WALLS, never an escape); ★ THE CONE OPENS (E-T3-AND-CONE): a one-pair cube room OPENS with the GPU up, walls=4, and the honest boundary caption; a FULLY-PAIRED cone form (d-1 · d+2 · d+3 — a sound Euclidean cone-manifold, 2 × 180°) OPENS with rodK carrying k≠4 entries the shader draws HEAVY — E³, cone, and bounded alike, one transport loop',
          get('explore.openPairRoomBuilt').ok && get('explore.boundedRoomOpens').ok && get('explore.coneFormBuilt').ok && get('explore.coneOpens').ok,
          `${get('explore.boundedRoomOpens').detail} · ${get('explore.coneOpens').detail}`);
        check('§E-DOOR-FEED ★★ THE PRISM ROOM BY THE PERSON\'S OWN HANDS (the partial\'s point): invoke Pentagon + Segment → thicken — the 8th word FEEDS its single-cell product as the aperture seed (the notice says so) → pair the two pentagon ends in the panel → glue → the room OPENS with the GPU up, walls=5 (the open sides), the fresh boundary caption ("the manifold ends here; the orbit recurs only through the glued corridors"), and ⛔ NO divergence claim on any caption (no sealed-vs-heuristic exists on single-cell — measured, the honest scope)',
          get('explore.thickenFeedsAperture').ok && get('explore.prismRoomBuilt').ok && get('explore.prismRoomOpens').ok,
          `${get('explore.thickenFeedsAperture').detail} · ${get('explore.prismRoomOpens').detail}`);
        check('§E-SHELL-INTACT ★★ CLOSE RETURNS TO THE UNHARMED SHELL + THE CARD DOORWAY + THE ESC LAW: closing the window leaves the SAME shell caption byte-equal, the selection held, and the Fit control live; the card\'s own doorway row re-opens the window; Esc closes the window ALONE (the selection survives — the shell is never falsified)',
          get('explore.shellIntactOnReturn').ok && get('explore.cardDoorPresent').ok && get('explore.cardDoorAndEsc').ok,
          `${get('explore.shellIntactOnReturn').detail} · ${get('explore.cardDoorAndEsc').detail}`);
        // THE INSIDE-VIEW HATCH (the SHELL's ink — the window's ink is the
        // shader's own now; the CPU-window live records retired with it)
        check('§E-HATCH ★ THE SHELL\'S SURFACE-LOCKED INK + THE CONFORMAL SEAM STAND (source-pinned): the screen-space fixed-angle families stay GONE from apertureInk (no px·cosA phase); the shell\'s hatch reads the trace\'s normal + objPos + facing channels and twists by the copy\'s parity; the nib scales the contour by depth; apertureModel\'s cone census reads the ONE seam (resolveConeAngleSource — measured via readPillarDihedrals + edgeClassOf when a dihedral-owning thicken product rides, k×90° otherwise) and the view wires the lineage lookup; apertureModel/apertureInk edits ride their OWN witnesses green',
          (() => {
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const inkSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureInk.ts'), 'utf8');
            const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
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
              (viewSrc.match(/toneGamma: apertureCtl\.toneGamma,/g) ?? []).length === 2
            );
          })(),
          'the shell-ink/seam pins');
        check('§E-GPU-SUBSTRATE THE PORT HOLDS ITS LAWS (source-pinned): the CPU still is DELETED (worker + walk model gone from the tree; no explore worker in the view — the fieldWorker is a different organ and stays); the shader carries the instrument\'s technique — the transport loop accumulating the deck word (`acc = mat3(g)*acc`), THE VOID IS PAPER, the geometry-anchored contour (screen derivatives of the normal), the settle-gated screen hatch, DECLARED-cone-edges-heavy from uRodHeavy — and the AUTHORED inhabitants as SDFs (sdPlaque with the per-side one-arc mouths + sdCoil right-handed; ZERO scan re-introduction); the door law admits every LEGAL pairing (only the impossible zero-pair refuses; the DOOR-FEED partial retired the fully-paired-only rule); the D1 window-ink block is reverted; the Esc guard closes the window FIRST; no π₁ person-facing',
          (() => {
            const windowSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const defaultsSrc = fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8');
            const exploreBlock = defaultsSrc.slice(defaultsSrc.indexOf('explore: {'), defaultsSrc.indexOf('junction: {'));
            return (
              !fs.existsSync(path.join(repoRoot, 'src/manuscript/exploreTraceWorker.ts')) &&
              !fs.existsSync(path.join(repoRoot, 'src/manuscript/exploreWindowModel.ts')) &&
              !fs.existsSync(path.join(repoRoot, 'src/manuscript/apertureProbeAssets.ts')) &&
              !viewSrc.includes('exploreTraceWorker') &&
              windowSrc.includes("getContext('webgl2'") &&
              windowSrc.includes('acc = mat3(g)*acc;') &&
              windowSrc.includes('THE VOID IS PAPER') &&
              windowSrc.includes('fwdD') &&
              windowSrc.includes('uHatch') &&
              windowSrc.includes('uRodHeavy[ei]>0.5') &&
              windowSrc.includes('sdPlaque') &&
              windowSrc.includes('sdCoil') &&
              !/masks_happy_and_sad|hand_pointing_capitolini|apertureProbeAssets/.test(windowSrc) &&
              windowSrc.includes('copies shown to depth') &&
              !/π₁|fundamental group/.test(windowSrc) &&
              viewSrc.includes('gate.deck.length === 0') &&
              !viewSrc.includes('EXPLORE_OPEN_PAIRS') &&
              viewSrc.includes('data-explore-refusal') &&
              viewSrc.includes('if (exploreOpenRef.current) {') &&
              !exploreBlock.includes('strokePitch') &&
              !exploreBlock.includes('resolution:') &&
              !/minimap|you are here|orbit diagram/.test(windowSrc)
            );
          })(),
          'the GPU port substrate pins');
        check('§E-BOUNDARY-WALL THE ROOM\'S EDGE IS DRAWN, NEVER ESCAPED (source-pinned, the DOOR-FEED partial): the cell surface read carries the per-face BOUNDARY verdict (readCellSurface — the witnessed apertureModel add; portals carry their deck transform, walls carry none); the shader\'s exit test walks the room\'s OWN face planes and a wall exit HITS the 2-cell (`uFaceWall[fE]>0.5` — never the escape-to-void); the JS walk STOPS the eye at a wall; the caption speaks the fresh sentence and NEVER the winding-tag\'s wording; the thicken gesture FEEDS a single-cell product as the panel seed with the honest multi-cell refusal and the cube one click away; ⛔ no `sealed` divergence claim in the window',
          (() => {
            const windowSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
            return (
              modelSrc.includes('export function readCellSurface') &&
              modelSrc.includes('wall: boolean; // true = the person\'s boundary — the room\'s edge, never an escape') &&
              windowSrc.includes('uFaceWall[fE]>0.5') &&
              windowSrc.includes('the manifold ends here; the orbit recurs only through the glued corridors') &&
              !windowSrc.includes('cone room · edges wind') &&
              !windowSrc.includes('sealed') &&
              windowSrc.includes('if (face.wall || !face.g) {') &&
              viewSrc.includes('readCellSurface(domain, coneEdgesDeclared)') &&
              viewSrc.includes('setApertureSeed(product)') &&
              viewSrc.includes('cannot open as a room yet') &&
              viewSrc.includes('build on the cube again')
            );
          })(),
          'the boundary-wall pins');
        check('§E-PART-A THE LEGIBILITY LAWS HOLD (source-pinned, 2026-08-11 seal + the 2026-08-12 DIAL-AXIS touch): the smooth rod (k=4) RECEDES IN WEIGHT — radius thins toward a guide AND its ink weight scales down, both LOG-SPACE (the recentre: equal dial steps = equal ratio steps; the linear mix crammed the action into the top ~20%) — while `classInk(uRodClass)` still keys its color; cone rods keep 0.042 + the heavy tone; the contour\'s depth weight is FRAME-NEAREST with the settable ratio; the LOD ladder is HARD gates ON THE ECHO AXIS (the fade\'s own axis — the content horizon; dep-gates were inert past extinction): the hatch STOPS beyond uLodMid, flat wash beyond uLodSmall, contour-only beyond uLodTiny; the five dials ride designDefaults + the leva group + the mount in echo units; the flat caption is explicit in the deckLine builder; the canvas context is alpha:false (a solid plate)',
          (() => {
            const windowSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
            const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
            const defaultsSrc = fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8');
            const exploreBlock = defaultsSrc.slice(defaultsSrc.indexOf('explore: {'), defaultsSrc.indexOf('junction: {'));
            return (
              windowSrc.includes('uniform float uSmoothRecede') &&
              windowSrc.includes('0.016*pow(0.4375, uSmoothRecede)') &&
              windowSrc.includes('weightScale = pow(0.35, uSmoothRecede)') &&
              !windowSrc.includes('mix(0.016, 0.007, uSmoothRecede)') &&
              windowSrc.includes('base=classInk(uRodClass[ei]);') &&
              windowSrc.includes('? 0.042 : gSmoothR') &&
              windowSrc.includes('tone*1.35') &&
              windowSrc.includes('1.0/max(uDepthRatio,1.0)') &&
              windowSrc.includes('if(echo > uLodMid)   hatch = 0.0;') &&
              windowSrc.includes('if(echo > uLodSmall) tone  = 0.0;') &&
              windowSrc.includes('if(echo > uLodTiny)  body  = 0.0;') &&
              !/if\(dep > uLod/.test(windowSrc) &&
              windowSrc.includes('alpha: false') &&
              viewSrc.includes('flat · no cone edges') &&
              viewSrc.includes('smoothRodRecede={exploreCtl.smoothRodRecede}') &&
              viewSrc.includes('lodTinyEcho={exploreCtl.lodTinyEcho}') &&
              exploreBlock.includes('smoothRodRecede:') &&
              exploreBlock.includes('depthWeightRatio:') &&
              exploreBlock.includes('lodMidEcho:') &&
              exploreBlock.includes('lodSmallEcho:') &&
              exploreBlock.includes('lodTinyEcho:') &&
              !exploreBlock.includes('lodMidDepth:')
            );
          })(),
          'the Part-A legibility pins (dial-axis recut)');
        check('§E-E6 THE ENCLOSURE-LOOK CURE HOLDS (source-pinned, mothership 1001): the smooth-rod recede GRADES ON RANK (wDepth folds into the smooth weightScale — the occupied room\'s rods present, distant recurrences receding harder; cone rods untouched); the focal hierarchy\'s weight argument is ECHO, not world travel ("the room you are in carries the frame" constructionally) and LOG-SPACE; the depth-break contour is ONE-SIDED (quad-parity sign — a rod behind a body draws NO line at the body\'s silhouette; the crease stays two-sided); the LOD echo trio is REACHABLE (mid < small < tiny < the level cap — every rung bites; the VALUES stay the designer\'s)',
          (() => {
            const windowSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
            const defaultsSrc = fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8');
            const exploreBlock = defaultsSrc.slice(defaultsSrc.indexOf('explore: {'), defaultsSrc.indexOf('junction: {'));
            const num = (src, key) => {
              const m = src.match(new RegExp(`${key}:\\s*([\\d.]+)`));
              return m ? Number(m[1]) : NaN;
            };
            const mid = num(exploreBlock, 'lodMidEcho');
            const small = num(exploreBlock, 'lodSmallEcho');
            const tiny = num(exploreBlock, 'lodTinyEcho');
            const level = num(defaultsSrc.slice(defaultsSrc.indexOf('aperture: {')), 'level');
            return (
              windowSrc.includes('weightScale = pow(0.35, uSmoothRecede) * wDepth') &&
              windowSrc.includes('sqrt(clamp(echo/max(float(uLevel),1.0)') &&
              !windowSrc.includes('dep/horizon') &&
              windowSrc.includes('pow(1.0/max(uDepthRatio,1.0)') &&
              windowSrc.includes('max(sqx*dFdx(dep), 0.0) + max(sqy*dFdy(dep), 0.0)') &&
              !windowSrc.includes('= fwidth(dep)') &&
              windowSrc.includes('fwdD(nrmOut)') &&
              Number.isFinite(mid) && Number.isFinite(small) && Number.isFinite(tiny) && Number.isFinite(level) &&
              mid < small && small < tiny && tiny < level
            );
          })(),
          'the E6 cure pins (structure, not the designer\'s values)');
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

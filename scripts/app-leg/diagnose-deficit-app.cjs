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

const repoRoot = path.resolve(__dirname, '..', '..');
const PORT = 5199;
const URL = `http://localhost:${PORT}/?manuscript`;

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
        out = execFileSync('python', [path.join(__dirname, 'deficit_app_driver.py'), '--url', URL], {
          encoding: 'utf8',
          timeout: 300000,
        });
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
        check('§E-CARD ★ THE ARGUMENT CARD RIDES THE LIVE APP: the MAP spine + INCIDENCE + STANCE + VERDICT sections and the demoted `certificate` receipt are all present on the fold-born\'s live card',
          get('card.mapSection').ok && get('card.incidence').ok && get('card.stance').ok && get('card.verdict').ok && get('card.certificate').ok);
        check('§E-CARD THE SIGN HAND CARRIES ITS GLYPHS (Phase-2 signs included: ⊾ ⌐ ⇄ ○ Σδ): every card sign draws distinct from the notdef box in the same hand (a tofu sign is a BLANK CLAIM)',
          get('card.glyphs').ok, get('card.glyphs').detail);
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

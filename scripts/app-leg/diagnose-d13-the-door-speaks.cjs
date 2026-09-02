#!/usr/bin/env node

// ⛔ DRIVE FAMILY — NOT A SWEEP WITNESS (B-111 §2, ruled; classified here by
// MEASUREMENT, correcting my own first count). This leg is a HYBRID: headless
// assertions PLUS a drive — and the drive half does not merely skip when no
// app is up, it SPAWNS ONE (`npm run dev --port 5199`) and drives it through
// python/playwright. A sweep that launches dev servers is not a headless
// sweep: it takes minutes, it needs python + playwright + a free port, and it
// owns 5199 while it runs.
// ⇒ ITS TRIGGER IS THE FIFTH WITNESS, never a calendar and never anyone's
// memory: THE DRIVE FAMILY RUNS AS PART OF ANY BUILD WHOSE READING TOUCHES
// ITS SUBJECT. If what a person SEES in this leg's subject is part of what
// you are reporting, this leg is part of your run.
// ⇒ The sweep classifies BY THIS DECLARATION, not by a directory or a list
// kept elsewhere: the sweep set is `grep -L "DRIVE FAMILY"` over
// scripts/app-leg/diagnose-*.cjs. The files do not move — committed reports
// cite them by path, and a moved file breaks a citation exactly as an
// overwritten plate does.

// DIAGNOSTIC — D13+D14 (engineer 2021, amended 2026-08-18): THE DOOR SPEAKS.
//
// D13 (URGENT — the app DIED): a person pairing a 3-corner face with a
// 4-corner face is an ORDINARY action; it black-screened the whole app
// (model throw, un-guarded render call, no boundary anywhere). The cure's
// three parts are each witnessed here: the honest refusal BY NAME, the
// render guard, and the error boundaries — tight (the page stands) and
// last-resort (the page's cost is spoken, never hidden).
//
// D14 (ADR 0024 §3.1, THE FAITHFULNESS CLAUSE): the fabricated positional
// letter is DELETED; a face's name is its CORNER LABELS in cycle order,
// rotated to the earliest, direction NOT normalized — read from the packet
// (`vertex.data.label`); where the packet carries none the name is
// `unnamed`, the ADR's own word (a thickened room reads `unnamed`
// CORRECTLY — thicken:175's id-as-label fabrication is a separate cut).
//
// ★ THE CARRY DECLARATION: the model cases hand shapes to the committed
// door model and read menus/refusals — no walking, no rendering. The app
// cases drive the RUNNING app (vite 5199 + playwright, the committed leg
// pattern); the input parcels are minted outside through the committed
// doors and enter through the person's own FILE door; the crash gestures
// (the mixed pick, the planted throws) are the app's own.
//
// Run directly (app-leg home; the flat 112-glob untouched):
//   node scripts/app-leg/diagnose-d13-the-door-speaks.cjs

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

// ---- the TS loader + the committed doors -----------------------------------
const tsc = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    tsc.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { esModuleInterop: true, module: tsc.ModuleKind.CommonJS, target: tsc.ScriptTarget.ES2020 },
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
const { liftSubComplex } = req('src/lib/subComplexLift.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const A = req('src/manuscript/apertureModel.ts');

console.log('THE D13+D14 WITNESS — the door speaks: the refusal, the guard, the boundary, and the ratified name\n');
console.log(
  'I hand shapes to the committed door model and read menus/refusals (no walking, no rendering);\n' +
    'the app cases drive the RUNNING app — the mixed pick and the planted throws are its own gestures.\n',
);

// ---- the fixtures ----------------------------------------------------------
const seed = createSeedShape('cube');
const cube1 = applyAmboDissection(seed);
const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;
const lift = openLift(terrain, mid, coreCell.id);
const tetra = createSeedShape('tetrahedron');
const segment = liftSubComplex(tetra, [{ kind: 'edge', id: tetra.edges[0].id }]).shape;
const band = thicken(lift.shape, segment).shape; // the thickened room — 3- AND 4-corner boundary faces

// ---- (a) D13 model: the non-congruent pick is a REFUSAL, not a throw -------
console.log('— (a) D13 · the model: a mixed pick refuses BY NAME; nothing throws —');
const bandMenu = A.boundaryFacesOf(band);
const tri = bandMenu.find((e) => /3 corners/.test(e.label));
const quad = bandMenu.find((e) => /4 corners/.test(e.label));
check('(a0) the fixture offers both shapes (the band carries 3- and 4-corner boundary faces)', Boolean(tri && quad));
{
  let threw = null;
  let out = null;
  try {
    out = A.dihedralMapCandidates(band, tri.id, quad.id);
  } catch (e) {
    threw = e;
  }
  check(
    '(a1) dihedralMapCandidates on the mixed pair returns NO candidates and does NOT throw (the black-screen class is dead at its root)',
    threw === null && Array.isArray(out) && out.length === 0,
    threw ? `THREW: ${String(threw.message).slice(0, 80)}` : `candidates=${out?.length}`,
  );
  const refusal = A.aperturePairingRefusal(band, [{ faceA: tri.id, faceB: quad.id, candidateKey: null }]);
  check(
    '(a2) aperturePairingRefusal NAMES it with the row\'s own numbers — the ratified sentence (flagged copy), NOT "pick the map"',
    typeof refusal === 'string' &&
      refusal.includes('a face meets only a face with the same corners') &&
      refusal.includes('this one has 3, that one has 4') &&
      refusal.includes('pick a partner with 3') &&
      !refusal.includes('identification MAP'),
    refusal ?? 'null',
  );
  let unknownThrew = false;
  try {
    A.dihedralMapCandidates(band, 'face:no-such-face', quad.id);
  } catch {
    unknownThrew = true;
  }
  check('(a3) the UNKNOWN-face throw STAYS a throw (that one IS a programming error)', unknownThrew);
}

// ---- (b) D13 · the congruent path is byte-behavior-identical ---------------
console.log('\n— (b) D13 · the congruent path unmoved —');
{
  const tris = bandMenu.filter((e) => /3 corners/.test(e.label));
  let found = 0;
  outer: for (let i = 0; i < tris.length; i += 1) {
    for (let j = i + 1; j < tris.length; j += 1) {
      try {
        found = A.dihedralMapCandidates(band, tris[i].id, tris[j].id).length;
        if (found > 0) break outer;
      } catch {
        // a non-congruent-in-metric pair — not this one
      }
    }
  }
  check('(b) a congruent pair still yields realizable candidates (the menu is alive, only the mixed pick is refused)', found > 0, `${found} candidates on the first realizable tri pair`);
}

// ---- (c) D14 · THE SOVEREIGN'S CASE: the ambo names its faces --------------
console.log('\n— (c) D14 · the ambo universe names faces by their OWN corners (ADR 0024 §3.1) —');
{
  const menu = A.boundaryFacesOf(cube1);
  check('(c1) NOTHING on the ambo menu is unnamed and NOTHING is a positional letter — every label is corner labels · count', menu.length > 0 && menu.every((e) => /^[A-Z]+(·[A-Z]+)+ · \d corners$/.test(e.label)), `${menu.length} entries`);
  // the cuboctahedron square, the Sovereign's own object — named by its four
  // midpoint corners even though it is an interior wall (the RULE names any
  // face; the menu shows the boundary ones)
  const sq = cube1.faces.find(
    (f) => cubocta.faceIds.includes(f.id) && f.vertexIds.length === 4 && f.vertexIds.every((v) => cube1.vertices[v].createdBy.sourceVertexIds.length === 2),
  );
  check('(c2) the cuboctahedron carries a midpoint square (the fixture is the walk he took)', Boolean(sq));
  if (sq) {
    const name = A.faceDisplayName(cube1, sq);
    const labels = sq.vertexIds.map((v) => cube1.vertices[v].data.label.toUpperCase());
    const parts = name.split('·');
    const isRotation = labels.some((_, k) => labels.every((__, i) => labels[(k + i) % labels.length] === parts[i]));
    const startsEarliest = parts[0] === [...labels].sort()[0];
    check(
      '(c3) the square is CALLED by its four corner labels — a ROTATION of its own cycle, starting at the earliest',
      parts.length === 4 && isRotation && startsEarliest && parts.every((p) => /^[A-Z]{2}$/.test(p)),
      `${name} ← cycle [${labels.join(',')}]`,
    );
  }
}

// ---- (d) D14 · the rule's two clauses, planted -----------------------------
console.log('\n— (d) D14 · rotation-to-earliest + direction NOT normalized (planted cycles) —');
{
  const plant = (labels) => ({
    id: 'shape:d14-plant',
    name: 'd14 plant',
    vertices: Object.fromEntries(
      labels.map((lab, i) => [
        `p${i}`,
        { id: `p${i}`, position: [i, 0, 0], data: { label: lab }, createdBy: { shapeId: 'shape:d14-plant', operation: 'seed', sourceVertexIds: [] } },
      ]),
    ),
    edges: [],
    faces: [{ id: 'face:plant', vertexIds: labels.map((_, i) => `p${i}`) }],
    cells: [{ id: 'cell:plant', faceIds: ['face:plant'], kind: 'core' }],
    generations: [],
    genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
  });
  const nameOf = (labels) => A.boundaryFacesOf(plant(labels))[0].label;
  check(
    "(d1) cycle D→A→C→B names 'A·C·B·D' — rotated to the earliest, the cycle's SENSE kept",
    nameOf(['D', 'A', 'C', 'B']) === 'A·C·B·D · 4 corners',
    nameOf(['D', 'A', 'C', 'B']),
  );
  check(
    "(d2) it is NOT 'A·B·C·D' — the sorted string would need a REVERSAL, which the rule forbids (dir is real information)",
    nameOf(['D', 'A', 'C', 'B']) !== 'A·B·C·D · 4 corners',
  );
  check(
    "(d3) lowercase packet labels surface UPPERCASE ('d','a','c','b' → 'A·C·B·D')",
    nameOf(['d', 'a', 'c', 'b']) === 'A·C·B·D · 4 corners',
    nameOf(['d', 'a', 'c', 'b']),
  );
  check(
    "(d4) a duplicate-label tie is total and stable (B,A,B,A → 'A·B·A·B', the least rotation — still never a reversal)",
    nameOf(['B', 'A', 'B', 'A']) === 'A·B·A·B · 4 corners',
    nameOf(['B', 'A', 'B', 'A']),
  );
  // ── I-1 clause 2(b): the two pins below were RE-PINNED FROM RULINGS, not
  // from observed output. (d5)'s old pin ("one unlabeled corner ⇒ whole face
  // `unnamed`") predated the 1555 ruling, which made this menu a REFERENCE
  // POSITION: "own name where a corner holds one, the honest address tail
  // where it does not, NEVER the word `unnamed`" (faceReferenceName's own
  // doctrine comment carries it). The NAME register keeps the absence word —
  // asserted here as the same fixture's second reading, so this arm still
  // separates the registers and still goes RED if either regresses: the menu
  // printing `unnamed` again, a partial fabrication in the name slot, or the
  // two registers collapsing into one another.
  const empty = plant(['A', '', 'C']);
  check(
    "(d5) THE 1555 SPLIT on a TRUE absence — the MENU (reference position) reads the absent corner's honest address tail, never `unnamed`; the NAME register on the same face still refuses whole (compose-over-absence lives where it belongs)",
    A.boundaryFacesOf(empty)[0].label === 'A·p1·C · 3 corners' && A.faceDisplayName(empty, empty.faces[0]) === 'unnamed',
    `menu: ${A.boundaryFacesOf(empty)[0].label} · name: ${A.faceDisplayName(empty, empty.faces[0])}`,
  );
  // (d6)'s old pin ("id-as-label ⇒ `unnamed`") pinned the scaffold clause,
  // whose DEATH-CONDITION was met and executed at c859458 (THE TERMINAL CUT,
  // B-2026-08-23-A 4c): every producer it stood for stopped minting id
  // copies, so a label is a NAME by POSITIVE PRESENCE and an id-copy label
  // is present content ('p1' composes, cased, as 'P1'). The refusal that
  // survives lives in the VIEW-side resolver for pre-migration FILES — not
  // in the composer. RED again if the scaffold resurrects (this reads
  // `unnamed`) or positive presence stops composing.
  const idAsLabel = plant(['A', 'B', 'C']);
  idAsLabel.vertices.p1.data.label = 'p1'; // an id-copy label — present content under the terminal cut
  check(
    "(d6) THE TERMINAL CUT (c859458): an id-copy LABEL is present content and composes by POSITIVE PRESENCE — the scaffold that read it as absence is dead with its producers",
    A.boundaryFacesOf(idAsLabel)[0].label === 'A·P1·C · 3 corners',
    A.boundaryFacesOf(idAsLabel)[0].label,
  );
}

// ---- (e) D14 · the thickened room COMPOSES its carried designations --------
// I-1 clause 2(b): the old pin ("every face reads `unnamed` — thicken:175
// fabricates id-as-label packets") recorded a disease the migration CURED:
// c859458's measured census has the thicken mint writing TRUE ABSENCE, and
// absence resolves through lineage, so the band's menu — a reference
// position per 1555 — composes carried designations. RED again if any face
// falls back to `unnamed` (the 1555 regression) or two faces collide (the
// individuation loss R4(a) was bought on).
console.log('\n— (e) D14 · the thickened room composes its carried designations — the migration landed —');
{
  const unnamedCount = bandMenu.filter((e) => /^unnamed/.test(e.label)).length;
  const distinct = new Set(bandMenu.map((e) => e.label)).size;
  check(
    "(e) EVERY boundary face of the thickened band composes (none reads `unnamed`, all distinct) — thicken's mint writes TRUE ABSENCE and lineage resolution carries the names (c859458 + the 1555 reference-position law)",
    bandMenu.length > 0 && unnamedCount === 0 && distinct === bandMenu.length,
    `${bandMenu.length} faces · ${unnamedCount} unnamed · ${distinct} distinct`,
  );
}

// ---- (f) the source pins ---------------------------------------------------
console.log('\n— (f) the cure\'s source pins —');
{
  const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  const shellSrc = fs.readFileSync(path.join(repoRoot, 'src/AppShell.tsx'), 'utf8');
  const boundarySrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptErrorBoundary.tsx'), 'utf8');
  const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
  check(
    // I-1 clause 2(b): the pinned call gained B-104 R2's refusal collector
    // (the empty-menu sentence) after this pin was written — re-pinned to
    // the call as the ruling shaped it; the guard's substance (a throw
    // becomes an empty menu, never a crash) is unchanged and still asserted.
    '(f1) §2 the render guard: the candidate build is try/caught on the render path (a throw becomes an empty menu) — the call threads the B-104 refusal collector',
    viewSrc.includes('dihedralMapCandidates(apertureVolume, row.faceA, row.faceB, (r) => refusals.push(r))') &&
      viewSrc.includes('mapChoices = [];'),
  );
  check(
    '(f2) §3 BOTH boundaries mounted with their honest scopes: tight around the panel (the page stands), last-resort in AppShell (the state\'s cost spoken)',
    viewSrc.includes('scope="the aperture panel (tight — the page is standing)"') &&
      shellSrc.includes('scope="the manuscript page (last resort — the page state did not survive)"') &&
      boundarySrc.includes('getDerivedStateFromError'),
  );
  check(
    '(f3) the boundary speaks the RATIFIED sentence (flagged) + the firing scope + the record line — and promises NO comfort',
    boundarySrc.includes('this could not be drawn, and the page has stopped rather than go blank. the details are in the record.') &&
      boundarySrc.includes('{this.props.scope}') &&
      boundarySrc.includes('console.error(`[manuscript boundary') &&
      !/your work is safe|nothing was lost|don.t worry/i.test(boundarySrc),
  );
  const mainSrc = fs.readFileSync(path.join(repoRoot, 'src/main.tsx'), 'utf8');
  check(
    '(f4) the fabricated letter is DEAD: the menuLetter FUNCTION is gone from the model (only the deletion comment remembers it); the name rule + unnamed are the only sources',
    !modelSrc.includes('function menuLetter') && modelSrc.includes("return 'unnamed'") && modelSrc.includes('function faceDisplayName'),
  );
  check(
    '(f6) the last-resort boundary rides EVERY mount of the page — AppShell AND the `?manuscript` dev route in main.tsx (the route the crash was found on had NO boundary; the leg caught it)',
    mainSrc.includes('scope="the manuscript page (last resort — the page state did not survive)"') &&
      shellSrc.includes('scope="the manuscript page (last resort — the page state did not survive)"'),
  );
  // ⚠ the new boundary file's completeness ROW is deliberately NOT pinned
  // here: this leg mints parcel files (write APIs), and the governance
  // grep-law forbids one script from both writing files and naming the
  // freeze records; the freeze-completeness witnesses own that row check
  // (an absent row fails them as `unlisted`).
  check(
    '(f5) the witness seams are DEV-gated (d13throw, like d10rows)',
    viewSrc.includes("get('d13throw')") &&
      /if \(!import\.meta\.env\.DEV\) return null;\s*\n\s*return new URLSearchParams\(window\.location\.search\)\.get\('d13throw'\)/.test(viewSrc),
  );
}

// ---- the APP: the person's own crash gestures, on the running app ----------
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
  console.log('\n— the RUNNING app: the mixed pick and the planted throws —');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hz-d13-'));
  const bandFile = path.join(dir, 'band.snapshot.json');
  fs.writeFileSync(bandFile, JSON.stringify(serializeSnapshot(band, lift.shape.id)));
  const server = spawn(`npm run dev -- --port ${PORT} --strictPort`, { cwd: repoRoot, stdio: 'ignore', shell: true });
  try {
    const up = await waitHttp(`http://localhost:${PORT}/`, 90000);
    check('§0 the committed dev app boots', up);
    if (up) {
      let out = '';
      try {
        out = execFileSync('python', [path.join(__dirname, 'd13_door_speaks_driver.py'), '--url', URL, '--band', bandFile], {
          encoding: 'utf8',
          timeout: 420000,
        });
      } catch (error) {
        out = `${error.stdout ?? ''}`;
        if (!out.trim()) check('§0 the driver ran', false, String(error.message).slice(0, 160));
      }
      let verdict = null;
      try {
        verdict = JSON.parse(out.trim().split(/\r?\n/).pop() ?? '');
      } catch {
        check('§0 the driver emitted a verdict', false, out.slice(-200));
      }
      if (verdict) {
        const r = verdict.results;
        const clause = (k, label) => {
          const v = r[k] ?? { ok: false, detail: 'clause missing' };
          check(label, v.ok, v.detail);
        };
        clause('mix.place', 'the thickened band places through the person\'s own doors');
        clause('mix.refusal', '★ the MIXED PICK on the LIVE app: the refusal fires BY NAME in the panel');
        clause('mix.alive', '★ AND THE APP IS STILL ALIVE — the panel renders, the canvas stands, no black screen');
        clause('mix.console', 'no uncaught error reached the console across the mixed pick');
        clause('tight.speaks', '★ the planted PANEL throw: the TIGHT boundary speaks the ratified sentence');
        clause('tight.pageStands', '★ and THE PAGE IS STANDING (canvas + dock alive — the person\'s work survives the tight catch)');
        clause('last.speaks', '★ the planted PAGE throw: the LAST-RESORT boundary speaks (never a blank void)');
        clause('last.honest', 'and its scope line admits the page state did not survive (no comfort the app cannot keep)');
      } else {
        failures += 1;
      }
    }
  } finally {
    killTree(server.pid);
  }
  console.log(failures === 0 ? '\nDIAGNOSE-D13-THE-DOOR-SPEAKS: ALL GREEN' : `\nDIAGNOSE-D13-THE-DOOR-SPEAKS: ${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})();

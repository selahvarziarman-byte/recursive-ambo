#!/usr/bin/env node

// DIAGNOSTIC — THE BOUNDED FORM (engineer-chartered 2026-07-18; HEAVY run,
// full protocol: two frozen files, two manifest re-seals, count 44;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_BOUNDED_FORM.md`,
// SHA-256 eb9bfcb4…d598c, natively measured; every pin below is the
// builder's own measurement).
//
// THE CLAUSE THIS RULES: faceIdentification's `count !== 1` held two facts in
// one predicate and nobody ever ruled it — count === 0 is an UNPAIRED face (a
// legitimate BOUNDARY), count > 1 is a face in several pairs (genuinely
// MALFORMED). One line closed the whole level-3 zoo to bounded forms. The
// person's own gate panel knew the difference all along, in two different
// sentences, and refused both. This build rules them apart:
//   faceIdentification — count === 0 carries as a verdict; count > 1 still
//     throws, message byte-identical;
//   level3SoundnessGate — boundary strata (edge links of valence 'boundary';
//     disk vertex links, χ=1, on free faces) read BOUNDARY, not defect; the
//     report carries a `boundary` reading (null on closed complexes);
//   apertureModel (the door) — the unpaired-face refusal is deleted; the
//     over-paired refusal stays byte-identical; the aperture label says
//     "bounded" and stops calling boundary dihedrals cone edges.
//
// THE ROUTE IS NAMED AND IT IS PRODUCTION (the mothership's clause, born of
// THE GATE shipping to a dev-only door): AppShell → ManuscriptView → the
// aperture gate panel → buildPersonDomainVerdict. The payoff leg below drives
// exactly that model path — never src/lib directly (self-asserted).
//
// ⛔ NO "NEW vs THE 79" CLAIM BY INVARIANT-MATCHING (the researcher's bound):
// the bounded form is bounded because it was CONSTRUCTED with an unpaired
// face; the class of each boundary component is a READING of the constructed
// complex (certified through the committed level-2 engine), never a newness
// argument.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { checkEngineFreeze, sha256OfCrStripped } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

// ── the person's surfaces (the payoff leg touches ONLY these — asserted) ──
const A = req('src/manuscript/apertureModel.ts');
const { createSeedShape } = req('src/data/seeds.ts');

// ── instrument surfaces (regression / certificate legs, never the payoff) ──
const F = req('src/lib/faceIdentification.ts');
const { classifyLevel3Soundness } = req('src/lib/level3SoundnessGate.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

// the ONE plumbing read (pinned in the flagship's HEAD-read inventory):
// HEAD-compiled engine stacks + non-movement + the manifest differential
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the bounded form: one predicate, two meanings, finally ruled — the person holds a 3-manifold with boundary (blind concretes)\n');

const cube = createSeedShape('cube');
const seed = F.readSeedCell(cube);
const faceOf = (side) => seed.faces.find((x) => x.id.includes(side)).id;

// ═════ [1] ★★★ the person's route, pasted — through the aperture gate ═════════════
console.log("----- [1] ★★★ THE PERSON'S ROUTE: two of three pairs, the third face free — a body with boundary (clause 1) -----");
// The payoff route — drives the MANUSCRIPT'S APERTURE MODEL and nothing else
// (self-asserted below: no src/lib in this function's source). The person
// pairs left~right and front~back, leaves top/bottom unpaired, and searches
// their own candidate menu exactly as the panel offers it.
function personsApertureRoute() {
  const menuLR = A.dihedralMapCandidates(cube, faceOf('left'), faceOf('right'));
  const menuFB = A.dihedralMapCandidates(cube, faceOf('front'), faceOf('back'));
  const survey = [];
  for (const c1 of menuLR) {
    for (const c2 of menuFB) {
      const rows = [
        { faceA: faceOf('left'), faceB: faceOf('right'), candidateKey: c1.key },
        { faceA: faceOf('front'), faceB: faceOf('back'), candidateKey: c2.key },
      ];
      const refusal = A.aperturePairingRefusal(cube, rows);
      if (refusal !== null) {
        survey.push({ keys: `${c1.key}/${c2.key}`, refusal });
        continue;
      }
      const verdict = A.buildPersonDomainVerdict(cube, rows, `bounded:${c1.key}:${c2.key}`, 'the bounded form');
      survey.push({ keys: `${c1.key}/${c2.key}`, rows, verdict });
    }
  }
  return survey;
}
const survey = personsApertureRoute();
const soundBounded = survey.filter((s) => s.verdict && !s.verdict.folded && s.verdict.domain.tower.sound &&
  s.verdict.domain.tower.gate.boundary !== null && s.verdict.domain.tower.gate.boundary.faceClasses.length === 2);
const t2iFamily = soundBounded.filter((s) => s.verdict.domain.tower.chi === 0 && s.verdict.domain.tower.orientable === true);
check('★★★ THE DOOR OPENS AND A BODY WITH BOUNDARY COMES BACK: the person pairs TWO of the three opposite cube-face pairs through the aperture gate (the PRODUCTION route: AppShell → ManuscriptView → the gate panel → buildPersonDomainVerdict), the third pair stays free, the door does NOT refuse (the "matching must be perfect" sentence is dead), the verdict reads SOUND with a boundary of exactly TWO face classes, the aperture DRAWS it (deck fitted, ok: true) and the label says BOUNDED — and the payoff route\'s source is self-asserted to touch nothing under src/lib',
  (() => {
    const first = t2iFamily[0];
    if (!first) {
      note('NO sound bounded χ=0 orientable candidate — report this');
      return false;
    }
    const gate = A.buildAperture(first.verdict.domain);
    const src = personsApertureRoute.toString();
    note(`the survey: ${survey.length} candidate combos · sound-with-2-boundary-faces: ${soundBounded.length} · χ=0 orientable (the T²×I family): ${t2iFamily.length} (first: ${first.keys})`);
    note(`refused combos: ${survey.filter((s) => s.refusal).length} (none may be the unpaired-face refusal)`);
    note(`aperture: ok=${gate.ok}${gate.ok ? ` · deck entries=${gate.deck.length} · label="${gate.geometry.label}"` : ` · ${gate.reason.slice(0, 80)}`}`);
    return t2iFamily.length >= 1 &&
      survey.every((s) => !s.refusal || !s.refusal.includes('not in any pair')) &&
      gate.ok === true && gate.geometry.boundary !== null && gate.geometry.label.includes('bounded') &&
      !src.includes('src/lib');
  })());

// ═════ [2] ★ T² × I — the first 3-manifold with boundary ══════════════════════════
console.log('\n----- [2] ★ T² × I: the boundary components, counted and CLASSED (clause 2) -----');
const T2I = t2iFamily[0];
check('★ ∂(T² × I) = TWO COPIES OF T², read off the person\'s own construction: the two free faces are TWO boundary components (no boundary edge class joins them), and EACH component\'s induced identification word — derived from the complex\'s own end classes — is certified by the COMMITTED LEVEL-2 ENGINE as "genus 1 (closed, orientable)", χ = 0. The class is a READING of the constructed complex, never an invariant-matching newness claim (the researcher\'s bound)',
  (() => {
    if (!T2I) return false;
    const complex = T2I.verdict.domain.complex;
    const boundary = T2I.verdict.domain.tower.gate.boundary;
    const freeFaces = complex.originalFaces.filter((face) => boundary.faceClasses.includes(complex.faceClassOf(face.id)));
    // component census: free faces joined iff they share a boundary edge class
    const classesOf = (face) => face.cycle.map((_, k) => complex.edgeClassOf(complex.edgeOfFaceSlot(face.id, k)));
    const shared = (fa, fb) => classesOf(fa).some((c) => classesOf(fb).includes(c));
    const components = [];
    for (const face of freeFaces) {
      const home = components.find((comp) => comp.some((member) => shared(member, face)));
      if (home) home.push(face);
      else components.push([face]);
    }
    note(`free faces: ${freeFaces.map((x) => x.id.split(':').pop()).join(' · ')} · boundary components: ${components.length}`);
    if (components.length !== 2 || components.some((comp) => comp.length !== 1)) return false;
    return components.every((comp) => {
      const face = comp[0];
      const slots = classesOf(face);
      const word = [];
      for (let i = 0; i < slots.length; i += 1) {
        for (let j = i + 1; j < slots.length; j += 1) {
          if (slots[i] === slots[j]) {
            const eI = complex.edgeOfFaceSlot(face.id, i);
            const eJ = complex.edgeOfFaceSlot(face.id, j);
            const parallel = complex.endClassOf(eI, face.cycle[i]) === complex.endClassOf(eJ, face.cycle[j]);
            word.push({ edgeA: i, edgeB: j, mode: parallel ? 'reversing' : 'preserving' });
          }
        }
      }
      const poly = loadForm(nGon(face.cycle.length), `bd:${face.id.split(':').pop()}`);
      const born = executeCustomGlue(poly, poly.faces[0], word, null);
      const inv = readFormInvariants(born, [poly]);
      note(`${face.id.split(':').pop()}: word ${word.map((w) => `(${w.edgeA},${w.edgeB},${w.mode[0]})`).join(' ')} → level-2 certificate: χ=${inv.chi} · "${inv.classification}"`);
      return inv.chi === 0 && inv.classification === 'genus 1 (closed, orientable)';
    });
  })());

// ═════ [3] ⛔ the regression that outranks the feature: the 512 ═══════════════════
console.log('\n----- [3] ⛔ THE 512: every closed cube-door form byte-identical to the HEAD engine (clause 3) -----');
const compileHead = (file, fakeName) => {
  const src = headBlobOf(file);
  const m = new Module.Module(fakeName);
  m.filename = path.join(repoRoot, 'src/lib', fakeName);
  m.paths = Module.Module._nodeModulePaths(path.dirname(m.filename));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: m.filename }).outputText, m.filename);
  return m.exports;
};
check('⛔ ALL 512 perfect-matching cube-door forms are BYTE-IDENTICAL between the working engine and the HEAD-COMPILED engine (HEAD faceIdentification + HEAD gate, compiled in-memory against the unmoved readers): identical glue counts and χ, identical gate verdicts modulo the new `boundary` key — which is asserted NULL on all 512 (the bounded door is INERT on the closed world) — and the census stands at 79 sound · 97 folded · 336 refused on BOTH stacks. If one of the 512 had moved, item 2 broke the closed world to open the bounded one, and this seal is void',
  (() => {
    const headF = compileHead('src/lib/faceIdentification.ts', 'faceIdentification.__head__.ts');
    const headGateMod = compileHead('src/lib/level3SoundnessGate.ts', 'level3SoundnessGate.__head__.ts');
    const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
    const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cube, faceOf(a), faceOf(b)));
    const stripBoundary = ({ boundary, ...rest }) => rest;
    let total = 0;
    let mismatches = 0;
    let boundaryNonNull = 0;
    const census = { work: { sound: 0, folded: 0, refused: 0 }, head: { sound: 0, folded: 0, refused: 0 } };
    const tally = (report, side) => {
      if (report.sound) census[side].sound += 1;
      else if (report.failures.some((x) => x.kind === 'folded-edge')) census[side].folded += 1;
      else census[side].refused += 1;
    };
    for (const c0 of menus[0]) {
      for (const c1 of menus[1]) {
        for (const c2 of menus[2]) {
          total += 1;
          const pairings = [
            { faceA: faceOf('left'), faceB: faceOf('right'), mode: c0.derivedMode, map: c0.map },
            { faceA: faceOf('front'), faceB: faceOf('back'), mode: c1.derivedMode, map: c1.map },
            { faceA: faceOf('bottom'), faceB: faceOf('top'), mode: c2.derivedMode, map: c2.map },
          ];
          const glueWith = (mod) => (pairings.some((p) => p.mode === 'reversing')
            ? mod.flipGlueFaces(mod.readSeedCell(cube), pairings)
            : mod.glueFaces(mod.readSeedCell(cube), pairings));
          const workComplex = glueWith(F);
          const headComplex = glueWith(headF);
          const workReport = classifyLevel3Soundness(workComplex);
          const headReport = headGateMod.classifyLevel3Soundness(headComplex);
          if (workReport.boundary !== null) boundaryNonNull += 1;
          tally(workReport, 'work');
          tally(headReport, 'head');
          // the projection strips BOTH sides: pre-commit the HEAD-compiled
          // gate has no `boundary` key (strip is a no-op); post-commit it has
          // the key at null — either way the remaining bytes must agree
          if (JSON.stringify(workComplex.counts) !== JSON.stringify(headComplex.counts) ||
            workComplex.chi !== headComplex.chi ||
            JSON.stringify(stripBoundary(workReport)) !== JSON.stringify(stripBoundary(headReport))) {
            mismatches += 1;
          }
        }
      }
    }
    note(`512 = ${total} · mismatches: ${mismatches} · boundary non-null on closed forms: ${boundaryNonNull}`);
    note(`census (working): ${census.work.sound} sound · ${census.work.folded} folded · ${census.work.refused} refused`);
    note(`census (HEAD)   : ${census.head.sound} sound · ${census.head.folded} folded · ${census.head.refused} refused`);
    return total === 512 && mismatches === 0 && boundaryNonNull === 0 &&
      census.work.sound === 79 && census.work.folded === 97 && census.work.refused === 336 &&
      census.head.sound === 79 && census.head.folded === 97 && census.head.refused === 336;
  })());

// ═════ [4] the malformed case still throws, verbatim ══════════════════════════════
console.log('\n----- [4] MALFORMED STILL THROWS: a face in two pairs, the message byte-identical (clause 4) -----');
check('`count > 1` WAS ALWAYS RIGHT — AND THE OLD PREDICATE BLAMED THE WRONG FACE: on a fixture that isolates the malformation (a full perfect matching PLUS a duplicate pairing — no face unpaired), BOTH engines throw the committed template BYTE-IDENTICALLY ("appears in 2 pairs — a perfect matching needs exactly 1"). And on the mandate\'s own conflation fixture (one face in two pairs, others free), the HEAD engine throws at the UNPAIRED face first ("appears in 0 pairs" — the boundary blamed for the malformation: the disease, exhibited) while the working engine names the genuinely malformed face',
  (() => {
    const headF = compileHead('src/lib/faceIdentification.ts', 'faceIdentification.__head2__.ts');
    const thrownBy = (mod, pairings) => {
      try {
        if (pairings.some((p) => p.mode === 'reversing')) mod.flipGlueFaces(mod.readSeedCell(cube), pairings);
        else mod.glueFaces(mod.readSeedCell(cube), pairings);
        return null;
      } catch (error) {
        return error.message;
      }
    };
    const pick = (a, b) => {
      const c = A.dihedralMapCandidates(cube, faceOf(a), faceOf(b))[0];
      return { faceA: faceOf(a), faceB: faceOf(b), mode: c.derivedMode, map: c.map };
    };
    // (i) the ISOLATED malformation: all six faces paired, one pairing doubled
    const doubled = [pick('left', 'right'), pick('front', 'back'), pick('bottom', 'top'), pick('left', 'right')];
    const workDoubled = thrownBy(F, doubled);
    const headDoubled = thrownBy(headF, doubled);
    note(`isolated (perfect + duplicate) — working: "${workDoubled ? workDoubled.slice(0, 92) : 'DID NOT THROW?!'}"`);
    note(`isolated — byte-identical across engines: ${workDoubled === headDoubled}`);
    // (ii) the CONFLATION fixture: one face in two pairs, four faces free.
    // ARRIVAL BRANCH: pre-commit HEAD still carries `count !== 1` and blames
    // the UNPAIRED face ("appears in 0 pairs" — the disease, exhibited);
    // post-commit the cure has arrived at HEAD and both engines name the
    // genuinely malformed face.
    const conflated = [pick('left', 'right'), pick('left', 'back')];
    const workConflated = thrownBy(F, conflated);
    const headConflated = thrownBy(headF, conflated);
    const headHasOldPredicate = headBlobOf('src/lib/faceIdentification.ts').includes('if (count !== 1) {');
    note(`conflation — working names: "${workConflated ? workConflated.slice(24, 92) : 'DID NOT THROW?!'}"`);
    note(`conflation — HEAD ${headHasOldPredicate ? 'blamed (old predicate)' : 'names (cure arrived)'}: "${headConflated ? headConflated.slice(24, 92) : 'DID NOT THROW?!'}"`);
    return workDoubled !== null && workDoubled === headDoubled &&
      workDoubled.includes('appears in 2 pairs — a perfect matching needs exactly 1') &&
      workConflated !== null && workConflated.includes('appears in 2 pairs') &&
      headConflated !== null &&
      (headHasOldPredicate ? headConflated.includes('appears in 0 pairs') : headConflated === workConflated);
  })());

// ═════ [5] the gate says boundary, not broken ═════════════════════════════════════
console.log('\n----- [5] BOUNDARY, NOT BROKEN: the verdict names its boundary; "unsound" appears nowhere on it (clause 5) -----');
check('THE VERDICT NAMES ITS BOUNDARY (card-union recut, B-2026-08-22-C): the bounded form reads sound: true with `boundary.faceClasses` naming its two free faces, the tower reads isClosed: false with chiConsistent NULL (the closed-world check does not apply to a room — never a judgement faked on a bounded object), the aperture label says "bounded — ∂ carries 2 face class(es)" — and the string "unsound" does not appear anywhere on the serialized verdict',
  (() => {
    if (!T2I) return false;
    const tower = T2I.verdict.domain.tower;
    const gate = A.buildAperture(T2I.verdict.domain);
    const serialized = JSON.stringify(T2I.verdict) + (gate.ok ? gate.geometry.label : gate.reason);
    note(`sound=${tower.sound} · χ=${tower.chi} · isClosed=${tower.isClosed} · chiConsistent=${tower.chiConsistent} · boundary.faceClasses=[${tower.gate.boundary.faceClasses.map((x) => x.split(':').pop()).join(', ')}]`);
    note(`"unsound" on the verdict: ${serialized.includes('unsound')}`);
    return tower.sound === true && tower.isClosed === false && tower.chiConsistent === null &&
      tower.gate.boundary.faceClasses.length === 2 &&
      !serialized.includes('unsound') && gate.ok && gate.geometry.label.includes('bounded');
  })());

// ═════ [6] the door's two refusals split ══════════════════════════════════════════
console.log('\n----- [6] THE DOOR\'S REFUSALS SPLIT: over-paired refused byte-identical; unpaired accepted (clause 6) -----');
check('THE TWO SENTENCES FINALLY DIVERGE: the over-paired refusal is BYTE-IDENTICAL to HEAD\'s committed sentence ("face … is picked 2 times — every face pairs exactly once.") while the unpaired-face rows are ACCEPTED (refusal: null) — the door keeps the wall that was always true and drops the one that never was',
  (() => {
    const over = A.aperturePairingRefusal(cube, [
      { faceA: faceOf('left'), faceB: faceOf('right'), candidateKey: 'd+0' },
      { faceA: faceOf('left'), faceB: faceOf('back'), candidateKey: 'd+0' },
    ]);
    const unpaired = A.aperturePairingRefusal(cube, [
      { faceA: faceOf('left'), faceB: faceOf('right'), candidateKey: 'd+0' },
      { faceA: faceOf('front'), faceB: faceOf('back'), candidateKey: 'd+0' },
    ]);
    const headDoor = headBlobOf('src/manuscript/apertureModel.ts');
    note(`over-paired: "${String(over)}" · unpaired: ${JSON.stringify(unpaired)}`);
    return over === 'face left is picked 2 times — every face pairs exactly once.' &&
      headDoor.includes('is picked ${count} times — every face pairs exactly once.') &&
      unpaired === null;
  })());

// ═════ [7] the acquisition chain — on-call, not on this path ══════════════════════
console.log('\n----- [7] THE ACQUISITION CHAIN: on-call — and this route never needed it (clause 7) -----');
check('THE CHAIN WAS NOT ON THIS PATH: the aperture route (readSeedCell → glueFaces → the gate → the tower → the domain) lives in the level-3 world and never touches `acquireComplex` — measured: apertureModel imports nothing from complexIdentification, and the whole route above ran end-to-end. The chain\'s known gap (assemble stamps parentShapeId: null) stays formally owed to the researcher; its next caller is the matching clause ((A/~)×I = (A×I)/(~×id)) — thicken, which rides behind. No STOP condition fired',
  (() => {
    const doorSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
    // D12-b recut (2026-08-19, disclosed): pin IMPORT statements, not any
    // source text — the scaffold's own comment now NAMES the quotient mint
    // (`complexIdentification:632`) as a manufacture site, which the old
    // whole-source grep read as the chain being on the path. The clause's
    // intent was always the import.
    const touches = /import[^;]*from\s+'[^']*complexIdentification'/.test(doorSrc) || /\bacquireComplex\s*\(/.test(doorSrc);
    note(`apertureModel imports complexIdentification / calls acquireComplex: ${touches} · the route ran end-to-end in [1]`);
    return !touches && t2iFamily.length >= 1;
  })());

// ═════ [8] the manifest: exactly two re-seals, count 44; the two ⛔ files unmoved ══
console.log('\n----- [8] THE MANIFEST: two re-seals in the same change, count 44; multiform + level3Invariants unmoved (clause 8) -----');
const freeze = checkEngineFreeze(repoRoot);
check('THE FULL PROTOCOL\'S BOOKKEEPING: the freeze reads ok at 45 with zero drift (the two sanctioned hash lines moved IN THIS SAME CHANGE — the freeze law); the manifest differs from HEAD in EXACTLY the two re-sealed lines (faceIdentification · level3SoundnessGate) plus nothing else; and the two ⛔ files the mandate names — multiform.ts and level3Invariants.ts — are CR-insensitively BYTE-IDENTICAL to HEAD',
  (() => {
    // THE SEALED FACT, state-independent (recut under THICKEN, 2026-07-18):
    // the exact-line differential was an over-pin — ANY later sanctioned
    // manifest motion (THICKEN's three re-seals were the first) broke it while
    // this arc's own truth stood. What THIS arc must hold forever: the two
    // files' CURRENT hashes are the ones the manifest seals, the freeze reads
    // ok at 45, and the two ⛔ files did not move. The flagship guards the
    // hash lines themselves in every state.
    const workManifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
    const sealedHere = ['src/lib/faceIdentification.ts', 'src/lib/level3SoundnessGate.ts'].every((file) =>
      workManifest.includes(sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8'))),
    );
    const unmoved = ['src/lib/multiform.ts', 'src/lib/level3Invariants.ts'].every(
      (file) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) === sha256OfCrStripped(headBlobOf(file)),
    );
    note(`freeze: ok=${freeze.ok} checked=${freeze.checked} · the two re-sealed hashes present in the manifest: ${sealedHere}`);
    return freeze.ok === true && freeze.checked === 48 /* 47 → 48: cornerCycleName.ts joined the frozen set at the A-3b closure cure (2d9eb97) — the ONE corner-cycle composer frozen beside its frozen consumer */ && sealedHere && unmoved;
  })());

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

#!/usr/bin/env node

// DIAGNOSTIC — THE FOLD PARITY (STAMP F-1, mothership-chartered 2026-09-03,
// after the hermeneutic office's unobliged measurement request P-H — the same
// content; the stamp supersedes the routing).
//
// THE LAW (the researcher-corrected, lawful form): in every CLOSED form the
// engine builds, the number of vertices whose link has ODD Euler characteristic
// is EVEN. Remove an open cone-neighbourhood of every vertex whose link is not
// S²; what remains is a compact 3-manifold M whose boundary is the disjoint
// union of the removed links, and χ(∂M) = 2χ(M) is even; S² and torus/Klein
// links contribute even χ, RP² links contribute 1. "RP² links pair" is the
// narrow instance (RP² alone bounds no compact 3-manifold; RP² × I bounds two).
//
// THE POPULATION — ONE PASS OVER EXISTING GATE DATA, no new engine code: the
// 512 door pairings of the cube (the aperture's own menus, the census
// witness's producer verbatim), read through the committed S² gate. The 97
// FOLDED forms are read AFTER the uniform bisection ADR 0022 §5-bis chartered
// (the fold midpoints become vertices whose links the gate can read; the
// un-subdivided gate carries a folded-edge VERDICT, not a link census).
//
// FALSIFIERS, each a finding: an odd count in some form = (i) a misread link χ,
// (ii) an unpaired face (the form is not closed — ∂M gained a component the
// argument did not count), or (iii) a non-isolated singular set (the
// truncation is not a manifold). THE REPORT IS PER FORM, never only in total:
// 212 RP² links in total is even and proves nothing — the law is that they
// pair FORM BY FORM.
//
// F-1 item 2 (the kind check) rides as an INSTANCE CENSUS: which folded forms
// could B.4's regular realizer even be run on — measured, with the realizer's
// own refusal as the witness. F-1 item 3 (ADR 0030 §7's ⚠) rides as a pin on
// the instrument's own header words.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell, glueFaces, flipGlueFaces } = req('src/lib/faceIdentification.ts');
const { readLevel3Tower } = req('src/lib/level3Invariants.ts');
const SUB = req('src/lib/level3Subdivision.ts');
const A = req('src/manuscript/apertureModel.ts');
const N = req('src/lib/noncubeDomain.ts');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('THE FOLD PARITY — every closed form pairs its odd-χ links (STAMP F-1; one pass over the committed gate)\n');

// ---------------------------------------------------------------------------
// the population — the census witness's producer, verbatim
// ---------------------------------------------------------------------------
const cube = createSeedShape('cube');
const seed = readSeedCell(cube);
const f = (k) => `face:cube:${k}`;
const AXES = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
const menus = AXES.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
const pairingsFor = (i, j, k) => [menus[0][i], menus[1][j], menus[2][k]].map((c, idx) => ({
  faceA: f(AXES[idx][0]), faceB: f(AXES[idx][1]), mode: c.derivedMode, map: c.map,
}));
const glue = (sd, ps) => (ps.some((p) => p.mode === 'reversing') ? flipGlueFaces(sd, ps) : glueFaces(sd, ps));
const bisected = SUB.bisectEdges(seed);

// THE COUNT — one predicate, used on the real gates and on the mutant below
const oddLinkCount = (vertexLinks) => vertexLinks.filter((l) => l.chi % 2 !== 0).length;

const forms = [];
for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
  const ps = pairingsFor(i, j, k);
  const before = readLevel3Tower(glue(seed, ps));
  let gate;
  let stratum;
  let stillFolded = false;
  let kSet = null;
  if (before.folded) {
    const after = readLevel3Tower(glue(bisected, SUB.liftPairingsToBisected(seed, ps)));
    stillFolded = after.folded;
    gate = after.folded ? after.gate : after.tower.gate;
    stratum = 'folded';
    const foldedRoots = new Set(before.gate.failures.filter((x) => x.kind === 'folded-edge').map((x) => x.classRoot));
    kSet = [...new Set(before.gate.edgeLinks.filter((l) => !foldedRoots.has(l.edgeClass)).map((l) => l.memberEdgeIds.length))].sort((a, b) => a - b);
  } else {
    gate = before.tower.gate;
    stratum = before.tower.sound ? 'sound' : 'rest';
    kSet = [...new Set(gate.edgeLinks.map((l) => l.memberEdgeIds.length))].sort((a, b) => a - b);
  }
  forms.push({
    combo: [i, j, k], stratum, stillFolded, kSet,
    closed: gate.boundary === null,
    odd: oddLinkCount(gate.vertexLinks),
    rp2: gate.vertexLinks.filter((l) => l.chi === 1).length,
    links: gate.vertexLinks.length,
  });
}

const by = (s) => forms.filter((x) => x.stratum === s);
const dist = (arr) => {
  const m = new Map();
  for (const x of arr) m.set(x.odd, (m.get(x.odd) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => a[0] - b[0]);
};
const distStr = (arr) => dist(arr).map(([o, n]) => `odd ${o} × ${n}`).join(' · ');

console.log('----- §1 the population: the partition sums to the whole, every form closed, no fold survives the bisection -----');
note(`sound ${by('sound').length} · the-rest ${by('rest').length} · folded ${by('folded').length} = ${forms.length}`);
check("§1 THE PARTITION SUMS TO THE WHOLE: sound 79 + the-rest 336 + folded 97 = 512 (the census witness's strata, re-measured here from the same producer)",
  by('sound').length === 79 && by('rest').length === 336 && by('folded').length === 97 && forms.length === 512);
check("§1 EVERY DOOR FORM IS CLOSED (gate.boundary === null on all 512, the folded ones read after bisection) — the law's hypothesis holds on the whole population, so an odd count could not hide behind an unpaired face",
  forms.every((x) => x.closed), `not closed: ${forms.filter((x) => !x.closed).length}`);
check('§1 NO FOLDED FORM IS STILL FOLDED AFTER THE UNIFORM BISECTION (0 of 97) — the fold midpoints are vertices now and their links are READ, not verdicted',
  by('folded').every((x) => !x.stillFolded), `still folded: ${by('folded').filter((x) => x.stillFolded).length}`);

console.log('\n----- §2 ★★ THE PARITY LAW, per form -----');
const oddForms = forms.filter((x) => x.odd % 2 !== 0);
note(`sound: ${distStr(by('sound'))}`);
note(`the-rest: ${distStr(by('rest'))}`);
note(`folded (bisected): ${distStr(by('folded'))}`);
check('§2 ★★ THE PARITY LAW: in EVERY closed form the number of odd-χ vertex links is EVEN — zero falsifiers among 512 (a falsifier would be a misread link χ, an unpaired face, or a non-isolated singular set — each a finding, none found)',
  oddForms.length === 0, `odd-count forms: ${JSON.stringify(oddForms.slice(0, 6).map((x) => ({ combo: x.combo, stratum: x.stratum, odd: x.odd })))}`);
check('§2 THE PER-FORM DISTRIBUTIONS, pinned AS MEASURED (the fence is not the finding — the counts are): sound {0 × 79} · the-rest {0 × 328, 2 × 8} · folded {2 × 88, 4 × 9}',
  JSON.stringify(dist(by('sound'))) === JSON.stringify([[0, 79]]) &&
    JSON.stringify(dist(by('rest'))) === JSON.stringify([[0, 328], [2, 8]]) &&
    JSON.stringify(dist(by('folded'))) === JSON.stringify([[2, 88], [4, 9]]),
  `${distStr(by('sound'))} | ${distStr(by('rest'))} | ${distStr(by('folded'))}`);

console.log('\n----- §3 the null control · §4 the positive control · the teeth -----');
const flatSound = by('sound').filter((x) => x.kSet.length === 1 && x.kSet[0] === 4);
check('§3 THE NULL CONTROL: the flat (every edge class k = 4) sound manifolds number 43 and every one reads 0 odd-χ links',
  flatSound.length === 43 && flatSound.every((x) => x.odd === 0), `flat sound ${flatSound.length}, odd among them ${flatSound.filter((x) => x.odd !== 0).length}`);
check('§3 …and the sound stratum entire reads 0 (a manifold has S² links only — 79 of 79)', by('sound').every((x) => x.odd === 0));
check('§4 THE POSITIVE CONTROL: every folded form reads ≥ 2 odd-χ links, never 1 (the fold is never one — its midpoint RP² pairs, with another midpoint or with a corner)',
  by('folded').every((x) => x.odd >= 2 && x.odd !== 1), `min ${Math.min(...by('folded').map((x) => x.odd))}`);
const rp2Folded = by('folded').reduce((s, x) => s + x.rp2, 0);
const rp2Rest = by('rest').reduce((s, x) => s + x.rp2, 0);
const restWithRp2 = by('rest').filter((x) => x.rp2 > 0);
note(`RP² (χ = 1) links: folded total ${rp2Folded} · the-rest total ${rp2Rest} in ${restWithRp2.length} forms`);
check("§4 THE TEETH: 212 RP² links over the folded forms in total (ADR 0022 §5-bis's 200 fold midpoints + 12 corners) — even in total, NECESSARY NOT SUFFICIENT; the law above is the per-form one — and the-rest's 16 RP² corners pair 2-by-2 in 8 forms",
  rp2Folded === 212 && rp2Rest === 16 && restWithRp2.length === 8 && restWithRp2.every((x) => x.rp2 === 2 && x.odd === 2),
  `folded ${rp2Folded} · rest ${rp2Rest} · rest forms with RP² ${restWithRp2.length}`);

console.log('\n----- §5 LAW 24 for the clause itself: the counting predicate is not vacuous -----');
const mutant = [{ chi: 2 }, { chi: 1 }, { chi: 0 }, { chi: 2 }];
check('§5 THE WITNESS CAN FAIL: the same predicate on a synthetic link list carrying a single RP² reads odd 1 — the parity assertion would go red on it',
  oddLinkCount(mutant) === 1 && oddLinkCount(mutant) % 2 !== 0);

console.log("\n----- §6 F-1 item 2 — THE KIND CHECK: the instance census, and the realizer's own refusal -----");
const foldedK = by('folded').map((x) => x.kSet);
const singleK = foldedK.filter((ks) => ks.length === 1 && ks[0] !== 4);
const allFlat = foldedK.filter((ks) => ks.length === 1 && ks[0] === 4);
const mixed = foldedK.filter((ks) => ks.length > 1);
const kValues = [...new Set(singleK.map((ks) => ks[0]))].sort((a, b) => a - b);
const perK = kValues.map((k) => `k=${k} × ${singleK.filter((ks) => ks[0] === k).length}`).join(' · ');
note(`folded forms by their NON-folded edge classes: single-k cone ${singleK.length} (${perK}) · all-flat ${allFlat.length} · mixed ${mixed.length}`);
check("§6 THE INSTANCE CENSUS: among the 97 folded forms the non-folded edge classes are single-k cone in 40 (k ∈ {6, 8} only), all-flat in 51, mixed in 6 — NO folded door form carries a single cone order k ∈ {3, 5}, the only ones a regular cube realizes (S³ at 120° = the tesseract's cell; H³ at 72° = {4,3,5})",
  singleK.length === 40 && allFlat.length === 51 && mixed.length === 6 && JSON.stringify(kValues) === '[6,8]',
  `single ${singleK.length} (${perK}) · flat ${allFlat.length} · mixed ${mixed.length}`);
// THE REALIZER, RUN — measured, not asserted (the first draft of this clause
// claimed the H³ dihedral solve refuses 60°; it does not: the IDEAL cube has a
// finite inradius, asinh(1/√2), and it is the VERTEX step that has no root).
const cCube = N.measureRegularNormalDot(cube);
const attempt = (geometry, k) => {
  const out = { dihedral: null, dihedralError: null, realized: null, realizeError: null };
  try {
    out.dihedral = N.solveDihedralInradius(geometry, cCube, (2 * Math.PI) / k);
  } catch (e) {
    out.dihedralError = String(e.message);
    return out;
  }
  try {
    out.realized = N.realizeRegularDomain(cube, geometry, (2 * Math.PI) / k).vertexPositions.size;
  } catch (e) {
    out.realizeError = String(e.message);
  }
  return out;
};
const h6 = attempt('H3', 6);
const h8 = attempt('H3', 8);
const s6 = attempt('S3', 6);
const s8 = attempt('S3', 8);
const h5 = attempt('H3', 5);
const s3 = attempt('S3', 3);
const say = (a) => (a.dihedralError ? 'dihedral refuses' : a.realizeError ? `dihedral d=${a.dihedral.toFixed(4)} · vertices: no root` : `realized, ${a.realized} vertices at d=${a.dihedral.toFixed(4)}`);
note(`H³ k=6: ${say(h6)} · H³ k=8: ${say(h8)} · S³ k=6: ${say(s6)} · S³ k=8: ${say(s8)} · H³ k=5: ${say(h5)} · S³ k=3: ${say(s3)}`);
check("§6 THE REALIZER'S OWN REFUSAL, on the cube's face family (c = 0): in H³ the dihedral solve LANDS at k = 6 (d = asinh(1/√2) ≈ 0.6585 — the IDEAL cube, its vertex link a euclidean 60°-triangle) and at k = 8, but the realization's radial vertex solve has NO ROOT for either (the vertices lie at or beyond infinity); in S³ the dihedral solve itself refuses 60° and 45° (the spherical cube runs 90°…180°); k = 5 in H³ (72°, {4,3,5}) and k = 3 in S³ (120°, the tesseract's cell) realize with 8 vertices — so the kind check has no regular-realizable instance among the folded door forms; \"cones cured by one measure\" stands pinned on the manifolds at diagnose-the-noncube-domain §3 (Seifert–Weber · Poincaré · the lenses), cited, not re-run",
  Math.abs(cCube) < 1e-12 &&
    h6.dihedral !== null && Math.abs(h6.dihedral - Math.asinh(Math.SQRT1_2)) < 1e-6 && /no root/.test(h6.realizeError ?? '') &&
    h8.dihedral !== null && /no root/.test(h8.realizeError ?? '') &&
    /never reaches/.test(s6.dihedralError ?? '') && /never reaches/.test(s8.dihedralError ?? '') &&
    h5.realized === 8 && s3.realized === 8,
  `${say(h6)} | ${say(h8)} | ${say(s6)} | ${say(s8)} | ${say(h5)} | ${say(s3)} | c=${cCube}`);
const extractorSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/level3LinkExtractor.ts'), 'utf8');
check('§6 "FOLDS UNTOUCHED BY ANY MEASURE" HOLDS BY CONSTRUCTION: the vertex-link reading is combinatorial — level3LinkExtractor reads classes and incidences and carries no `.position` read and no distance (a realization moves positions; it cannot move a link\'s χ) — the same position-blindness diagnose-the-noncube-domain §5 pins for the deck-fit checker',
  !/\.position\b/.test(extractorSrc) && !/distance/i.test(extractorSrc));

console.log("\n----- §7 F-1 item 3 — ADR 0030 §7's ⚠: the instrument's header, in its own words -----");
const instrumentSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/connectionWaveInstrumentV0.ts'), 'utf8');
check("§7 CONFIRMED FROM THE HEADER: connectionWaveInstrumentV0 lays the COMMITTED perCycleW1 on a flat ±1 spanning-tree gauge — tree edges +1, each non-tree edge carrying (−1)^perCycleW1 of its fundamental cycle — i.e. the orientation character as the fiber (the researcher's reading of instance-zero holds: yes)",
  instrumentSrc.includes('flat gauge of the COMMITTED holonomy') &&
    instrumentSrc.includes('build a spanning-tree representative: tree edges +1') &&
    instrumentSrc.includes('`(-1)^perCycleW1` when it') &&
    instrumentSrc.includes('the connection `U` is a real scalar sign ±1'));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-FOLD-PARITY: ALL PASS — every closed form pairs its odd-χ links' : `DIAGNOSE-THE-FOLD-PARITY: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

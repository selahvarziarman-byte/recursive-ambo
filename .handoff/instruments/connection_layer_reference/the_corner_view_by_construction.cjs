#!/usr/bin/env node
// THE CORNER VIEW BY CONSTRUCTION — a probe of the researcher seat (2026-09-29), for D14 (the coordinate leg; the ruling THE
// SECOND RESOLUTION §2; the mothership's question 2 of 10:00, the agent's R-D2).
//
// THE PREDICTION. D14 says the seed corner's view at a generation-2 medial site is read from the coordinate map with no act,
// and a path through it inherits the generation-1 passage's verdict. The agent produced that view BY HAND (70 coordinate
// relatings, `figures-in`), so its two saved sortings are a before (A: no corner acts) and an after (B: the corner view
// present) of exactly the reading D14 defines. If D14 is right: (1) nothing ENTERED an own part between A and B; (2) what
// LEFT each own part is exactly the part of own(A) that the seed corner's view composes in B (own(A) ∩ face_seed(B));
// (3) every passage through a seed corner reads COMPOSED or NOT — decidable by construction, never a light, never unruled;
// (4) every `your says differ` flag of B names the seed corner alone (the coordinate pseudo-word, which D14 removes).
// A relating that entered, a non-seed relating that left, or a seed passage read LIGHT/UNRULED falsifies D14's account.
//
// THE DATA: `.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/ta2/g2_sorting_A.json` and `_B.json` — the DEVICE's cards at
// 925a177, saved by the agent (⚠ its files; the mothership verified their own-part counts 41 / 29 at its hand). This probe
// reads the cards' text and nothing of the code. Seals are stated here before the run; the RESULTS file beside is its run.
//
// Run from the repo root: node .handoff/instruments/connection_layer_reference/the_corner_view_by_construction.cjs

const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const dir = path.join(repoRoot, '.handoff', 'REPORTS_CUSTOMER-SIDE_2026-09-28', 'saves', 'ta2');
const A = require(path.join(dir, 'g2_sorting_A.json'));
const B = require(path.join(dir, 'g2_sorting_B.json'));

let failures = 0;
const seal = (name, ok, detail) => { console.log(`${ok ? 'HELD' : 'BROKE'}  ${name}${detail ? `\n        ${detail}` : ''}`); if (!ok) failures += 1; };
const line = (t) => console.log(`      · ${t}`);

const itemsAfterColon = (s) => { if (!s) return []; const i = s.lastIndexOf(': '); return i < 0 ? [] : s.slice(i + 2).split(' · ').map((t) => t.trim()).filter(Boolean); };
const viewName = (v) => { const m = v.match(/^through (.+?): (\d+) passages?$/); if (m) return { name: m[1], n: Number(m[2]) }; const m2 = v.match(/^(.+?) — no passage yet/); return m2 ? { name: m2[1], n: 0 } : { name: v, n: null }; };
const faceOf = (faces, name) => { const f = faces.find((t) => t.includes(`through ${name} too:`)); return f ? itemsAfterColon(f) : []; };
const isSeedRole = (z) => /^[A-Z]\d+$/.test(z); // a seed role id (V3) — a midpoint view's z is an instance key with spaces or ≡

const medial = Object.keys(A).filter((k) => A[k].views.length === 3);
const corner = Object.keys(A).filter((k) => A[k].views.length === 2);
let ownA = 0, ownB = 0, entered = 0, leftNotSeed = 0, leftMismatch = 0, seedPassages = 0, seedBad = 0, seedCountMismatch = 0, differNotSeed = 0, differLines = 0;
const perSite = [];
for (const k of medial) {
  const a = A[k], b = B[k];
  const oA = new Set(itemsAfterColon(a.own)), oB = new Set(itemsAfterColon(b.own));
  ownA += oA.size; ownB += oB.size;
  const seed = a.views.map(viewName).find((v) => v.n === 0); // the view that had no passage in A: the seed corner
  const seedName = seed ? seed.name : null;
  const fSeedB = new Set(faceOf(b.faces, seedName));
  const left = [...oA].filter((x) => !oB.has(x));
  const came = [...oB].filter((x) => !oA.has(x));
  entered += came.length;
  for (const x of left) if (!fSeedB.has(x)) leftNotSeed += 1;
  const predictedLeft = [...oA].filter((x) => fSeedB.has(x));
  if (predictedLeft.length !== left.length || predictedLeft.some((x) => !left.includes(x))) leftMismatch += 1;
  const seedReads = b.readings.filter((r) => isSeedRole(r[0].split('|')[2]));
  seedPassages += seedReads.length;
  for (const r of seedReads) if (r[1] !== 'COMPOSED' && r[1] !== 'NOT') seedBad += 1;
  const seedViewB = b.views.map(viewName).find((v) => v.name === seedName);
  if (!seedViewB || seedViewB.n !== seedReads.length) seedCountMismatch += 1;
  for (const d of b.differ) { differLines += 1; const names = [...d.matchAll(/through (.+?) you said/g)].map((m) => m[1]); if (names.some((n) => n !== seedName)) differNotSeed += 1; }
  perSite.push(`${k}: own ${oA.size} → ${oB.size} · left ${left.length} (seed composes ${predictedLeft.length}) · entered ${came.length} · seed passages ${seedReads.length} · ${a.stateAttr} → ${b.stateAttr}`);
}
console.log('THE CORNER VIEW BY CONSTRUCTION — the researcher\'s probe on run 2\'s saved sortings (A: no corner acts · B: the corner view by hand)\n');
seal('S1 the own parts at the 12 medial sites total 41 in A and 29 in B (the mothership\'s verification, as the control)', medial.length === 12 && ownA === 41 && ownB === 29, `medial sites ${medial.length} · own A ${ownA} · own B ${ownB}`);
seal('S2 NOTHING ENTERED an own part between A and B', entered === 0, `entered: ${entered}`);
seal('S3 what LEFT each own part is exactly own(A) ∩ the seed corner\'s face line in B — per site, nothing else left', leftNotSeed === 0 && leftMismatch === 0, `left outside the seed face: ${leftNotSeed} · sites where predicted ≠ left: ${leftMismatch}`);
seal('S4 every passage through a seed corner in B reads COMPOSED or NOT (decidable by construction), and their count per site is the view line\'s', seedBad === 0 && seedCountMismatch === 0, `seed passages ${seedPassages} · not COMPOSED/NOT: ${seedBad} · count mismatches: ${seedCountMismatch}`);
seal('S5 every `your says differ` flag in B names the seed corner alone (the coordinate pseudo-word)', differNotSeed === 0, `differ lines ${differLines} · naming another view: ${differNotSeed}`);
console.log('');
line(`seed-corner passages at the medial sites in B: ${seedPassages} (the report says 80 of the 228 opened by the corner acts were at the medial sites)`);
line(`corner sites: ${corner.length}; UNDETECTED in A: ${corner.filter((k) => A[k].stateAttr === 'UNDETECTED').length}; states in B: ${corner.map((k) => B[k].stateAttr).join(' ')}`);
for (const s of perSite) line(s);
console.log(`\n${failures === 0 ? 'ALL SEALS HELD' : `${failures} SEAL(S) BROKE`}`);
process.exit(failures === 0 ? 0 : 1);

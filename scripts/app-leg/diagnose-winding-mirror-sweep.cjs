#!/usr/bin/env node

// DIAGNOSTIC — THE WINDING MIRROR SWEEP (engineer 1230/1300 charter): the
// STANDING form of the 512-word reachability sweep behind the winding
// route's acceptance #4.
//
// ★★ AND ITS FIRST RUN OVERTURNED THE CLAIM IT WAS BUILT TO KEEP: the
// route's report said "mirrored — NOT REACHABLE, said rather than planted."
// THAT WAS FALSE — the scratchpad sweep it rested on carried an indexing
// bug (it tested the ball against mis-sliced prefixes and missed exact
// returns). The truth, measured here: `mirrored` IS reachable on today's
// doors — e.g. the sound word d+0,d+1,d+2, a straight +y walk, returns the
// entry in ONE door with a reflection deck (trace +1, det −1; the z-flip
// re-enters 0.2 u from the entry — inside the app's 0.35 ball). The
// engineer's charter reasoning ("kept, it re-asks itself and fails loudly")
// fired on run one, against its own author.
//
// What stands now: (a) the POSITIVE fact — mirrored straight returns exist,
// named; (b) the reachability BASELINE (sound-word count · mirrored-return
// count) pinned exactly, so any change to the door set (e.g. the
// interior-transport cure) fails this witness loudly and forces the
// question to be re-asked rather than assumed.
//
// Model-only but MINUTES-slow (512 × the full verdict + tower) — hence the
// app-leg home, not the flat 112 glob. Run directly:
//   node scripts/app-leg/diagnose-winding-mirror-sweep.cjs

const path = require('node:path');
const fs = require('node:fs');
const repoRoot = path.resolve(__dirname, '..', '..');
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
const A = req('src/manuscript/apertureModel.ts');
const { simulateWalk, straightLine, ENTRY } = require('./lib/windingWalk.cjs');

console.log('I enumerate the 512 single-cell cube words and walk straight lines from the window entry; I do NOT render.');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

const cube = createSeedShape('cube');
const pairs = [
  ['face:cube:left', 'face:cube:right'],
  ['face:cube:top', 'face:cube:bottom'],
  ['face:cube:front', 'face:cube:back'],
];
const keys = ['d+0', 'd+1', 'd+2', 'd+3', 'd-0', 'd-1', 'd-2', 'd-3'];
const axes = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

let soundWords = 0;
let mirroredReturns = 0;
const mirroredExamples = [];
for (const k1 of keys) {
  for (const k2 of keys) {
    for (const k3 of keys) {
      let domain;
      try {
        const v = A.buildPersonDomainVerdict(
          cube,
          pairs.map((p, i) => ({ faceA: p[0], faceB: p[1], candidateKey: [k1, k2, k3][i] })),
          'sweep',
          'sweep',
        );
        if (v.folded || !v.domain.tower.sound) continue;
        domain = v.domain;
      } catch {
        continue; // an unrealizable key on this pair — not a room
      }
      soundWords += 1;
      const surface = A.readCellSurface(domain, true);
      for (const axis of axes) {
        // the APP's own return law (RETURN_EPS 0.35 / arm 0.6125) — the
        // sweep asks what the WINDOW would announce, not a stricter question
        const sim = simulateWalk(surface, ENTRY, straightLine(ENTRY, axis, 4, 80), { returnEps: 0.35, armEps: 0.6125 });
        if (!sim.returned) continue;
        if (sim.handedness < 0) {
          mirroredReturns += 1;
          if (mirroredExamples.length < 3)
            mirroredExamples.push(`${[k1, k2, k3].join(',')}@${JSON.stringify(axis)}→${sim.doorsAtReturn} door(s)`);
        }
      }
    }
  }
}

console.log(`\nswept: ${soundWords} sound words × 6 axes (the app's own 0.35 return ball)`);
check(
  '★ MIRRORED IS REACHABLE on today\'s doors — the positive fact that overturned the route report\'s acceptance-#4 claim: sound rooms return the entry on straight axis walks with a reflection deck',
  mirroredReturns > 0 && mirroredExamples.some((e) => e.startsWith('d+0,d+1,d+2')),
  `${mirroredReturns} mirrored returns · e.g. ${mirroredExamples.join(' · ')}`,
);
check(
  '★ THE REACHABILITY BASELINE, pinned exactly (79 sound words · 70 mirrored axis returns at the 0.35 ball): any drift means the door set changed (e.g. the interior-transport cure) — this witness fails loudly and the question is RE-ASKED, never assumed',
  soundWords === 79 && mirroredReturns === 70,
  `sound ${soundWords} · mirrored ${mirroredReturns}`,
);

console.log(failures === 0 ? '\nDIAGNOSE-WINDING-MIRROR-SWEEP: ALL GREEN' : `\nDIAGNOSE-WINDING-MIRROR-SWEEP: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

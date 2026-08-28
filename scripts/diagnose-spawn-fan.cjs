#!/usr/bin/env node

// DIAGNOSTIC — B-124: THE FAN AT REST (F.1–F.5, the designer's ruling).
// The defect this guards against returning: `spawnOffset` consumed as a
// CONSTANT slot — every child of a parent ASSIGNED THE SAME HOME, so six
// children presented as ONE THING and a spent parent was indistinguishable
// from a parent with five left (a FALSE COUNT at the eye).
//
// THE TEETH:
//   §1 F.1 — the at-rest lay is COUNTABLE: successive births take slots that
//      are pairwise clear, at pairwise-distinct edge angles, first slot = the
//      old constant's own slot; and the POSITIVE CONTROL (LAW 24): the old
//      constant lay FAILS these same assertions;
//   §2 F.2 — the placement is computed from the PARENT'S EXISTING CHILDREN:
//      an occupied slot is skipped, a slot freed by his drag is REUSED,
//      another parent's children are invisible, a connected-sum child
//      (parentShapes) occupies;
//   §3 F.3/F.4 at the view — ONE PRODUCER: the old expression is GONE, the
//      producer is called at exactly the four birth sites, each inside a
//      `setWritten((cur) => [...cur, …])` appender (the result reaches ONLY
//      the newborn's own entry — the page never re-places what stands), and
//      the module itself mutates nothing it reads;
//   §4 the REAL story (committed doors, no fixture): a square worked through
//      six real births fans into six clear homes at six distinct angles.

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
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { FAN, spawnFanSlots, spawnFanHome, spawnHomeForBirth } = req('src/manuscript/spawnFanModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const stripped = (body) =>
  body
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .map((l) => l.split('//')[0])
    .join('\n');

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const angleDeg = (parent, h) => (Math.atan2(h[1] - parent[1], h[0] - parent[0]) * 180) / Math.PI;
// the F.1 measurements over any lay: pairwise clearances and edge angles
const layReport = (parent, homes) => {
  let minDist = Infinity;
  let minAngleGap = Infinity;
  for (let i = 0; i < homes.length; i += 1) {
    for (let j = i + 1; j < homes.length; j += 1) {
      minDist = Math.min(minDist, dist(homes[i], homes[j]));
      minAngleGap = Math.min(minAngleGap, Math.abs(angleDeg(parent, homes[i]) - angleDeg(parent, homes[j])));
    }
  }
  return { minDist, minAngleGap };
};

console.log('B-124 — THE FAN AT REST: N children must be countable, touching nothing\n');

// ═════ §1 F.1 — the at-rest lay is countable, and the old lay is not ═════════
console.log('----- §1 the ladder: clear slots, distinct edges, and the defect as control -----');
{
  const parent = [3, -2, 0];
  const RADIUS = 6;
  const homes = [];
  for (let n = 0; n < 13; n += 1) homes.push(spawnFanHome(parent, homes, RADIUS));
  const { minDist, minAngleGap } = layReport(parent, homes);
  check('§1 slot 1 IS the old constant\'s slot — a single child lands exactly where it always did', dist(homes[0], [parent[0] + RADIUS, parent[1]]) < 1e-9);
  check(`§1 ★ 13 at-rest births: pairwise ≥ clearance (${FAN.clearance}) — nothing coincides`, minDist >= FAN.clearance - 1e-9);
  check('§1 ★ 13 at-rest births: pairwise edge angles distinct by ≥ 8° — N edges are N lines at the eye', minAngleGap >= 8 - 1e-9);
  note(`minDist ${minDist.toFixed(3)} world · minAngleGap ${minAngleGap.toFixed(2)}° · extents y∈[${Math.min(...homes.map((h) => h[1] - parent[1])).toFixed(2)}, ${Math.max(...homes.map((h) => h[1] - parent[1])).toFixed(2)}] rel`);
  const again = [];
  for (let n = 0; n < 13; n += 1) again.push(spawnFanHome(parent, again, RADIUS));
  check('§1 deterministic — the same begetting sequence lays the same fan', JSON.stringify(homes) === JSON.stringify(again));
  // LAW 24 — the positive control: the OLD mechanism fails the same bar
  const oldLay = Array.from({ length: 6 }, () => [parent[0] + RADIUS, parent[1], 0]);
  const old = layReport(parent, oldLay);
  check('§1 ⛔ CONTROL: the constant-offset lay (the defect) FAILS the clearance bar — six children, one home', old.minDist < FAN.clearance);
  note(`control minDist ${old.minDist} (six coincident homes) — the bar can catch the defect it exists for`);
  // ring-1 chord: adjacent same-ring slots stay a form's width apart
  const ring1 = spawnFanSlots(parent, RADIUS, 1);
  const chord = dist(ring1[0], ring1[1]);
  check('§1 ring-1 chord ≥ 3.5 world — adjacent siblings never touch', chord >= 3.5);
  note(`ring-1 slots ${ring1.length} · chord ${chord.toFixed(3)} · ring-2 slots ${spawnFanSlots(parent, RADIUS, 2).length}`);
}

// ═════ §2 F.2 — placed from the POPULATION, never from a constant ════════════
console.log('----- §2 the population decides: occupied skips, freed reuses, foreign is invisible -----');
{
  const parent = [0, 0, 0];
  const RADIUS = 6;
  const slot0 = [RADIUS, 0, 0];
  check('§2 empty population → slot 0', dist(spawnFanHome(parent, [], RADIUS), slot0) < 1e-9);
  const second = spawnFanHome(parent, [slot0], RADIUS);
  check('§2 slot 0 occupied → the next birth takes a DIFFERENT slot', dist(second, slot0) >= FAN.clearance);
  // his drag FREES the slot: the child that held slot 0 now lives far away
  const dragged = [[40, 25, 0]];
  check('§2 ★ a slot his drag emptied is REUSED — the fan reads the page, not a memory of it', dist(spawnFanHome(parent, dragged, RADIUS), slot0) < 1e-9);
  // a child he parked NEAR a slot blocks it without sitting on it
  const parked = [[RADIUS + FAN.clearance * 0.5, 0.3, 0]];
  check('§2 a child parked within clearance of a slot OCCUPIES it', dist(spawnFanHome(parent, parked, RADIUS), slot0) >= FAN.clearance * 0.4);
  // the per-parent filter: another parent's children do not crowd this fan
  const target = { shape: { id: 'P' }, home: parent };
  const foreign = [{ form: { parentShape: { id: 'OTHER' } }, home: slot0 }];
  check('§2 ★ ANOTHER parent\'s child on my slot is invisible to MY fan (per-parent placement)', dist(spawnHomeForBirth(target, foreign, RADIUS), slot0) < 1e-9);
  const mine = [{ form: { parentShape: { id: 'P' } }, home: slot0 }];
  check('§2 my own child occupies', dist(spawnHomeForBirth(target, mine, RADIUS), slot0) >= FAN.clearance);
  const sumChild = [{ form: { parentShape: null, parentShapes: [{ id: 'X' }, { id: 'P' }] }, home: slot0 }];
  check('§2 a connected-sum child naming me among parentShapes occupies — the fan fans exactly what has edges', dist(spawnHomeForBirth(target, sumChild, RADIUS), slot0) >= FAN.clearance);
}

// ═════ §3 F.3/F.4 — one producer, initial lay only, at the view ══════════════
console.log('----- §3 the view: one producer, four sites, appender-only, module mutates nothing -----');
{
  const view = stripped(fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8'));
  check('§3 control: the view source is non-empty and holds the import', view.length > 1000 && view.includes("from './spawnFanModel'"));
  const oldExpr = /home\[0\]\s*\+\s*(d\.world\.chrome\.)?spawnOffset/;
  check('§3 ⛔ THE OLD EXPRESSION IS GONE — no birth site computes a constant slot', !oldExpr.test(view));
  const calls = view.match(/spawnHomeForBirth\(target, cur, d\.world\.chrome\.spawnOffset\)/g) ?? [];
  check('§3 ★ F.4 ONE PRODUCER — exactly four birth sites, all calling the one function with the one radius knob', calls.length === 4);
  const spawnOffsetUses = view.match(/spawnOffset/g) ?? [];
  note(`producer calls ${calls.length} · spawnOffset tokens in view ${spawnOffsetUses.length} (4 calls + dep arrays)`);
  // F.3 at the sites: the producer's answer lands ONLY as the appended
  // newborn's own home — every call sits inside a `[...cur, { … }]` appender
  const appender = view.match(/\[\s*\.\.\.cur,\s*\{[^}]*spawnHomeForBirth\(target, cur, d\.world\.chrome\.spawnOffset\)[^}]*\}\s*,?\s*\]/g) ?? [];
  check('§3 ★★ F.3 — all four calls are APPENDER-ONLY: the fan writes the newborn and never re-places what stands', appender.length === 4);
  check('§3 the view holds no second door into the geometry (no direct spawnFanHome/spawnFanSlots call)', !view.includes('spawnFanHome(') && !view.includes('spawnFanSlots('));
  // the module is pure: what it reads it does not change
  const parent = [1, 1, 0];
  const written = [
    { form: { parentShape: { id: 'P' } }, home: [7, 1, 0] },
    { form: { parentShape: { id: 'P' } }, home: [5.9, 4.4, 0] },
  ];
  const before = JSON.stringify(written);
  spawnHomeForBirth({ shape: { id: 'P' }, home: parent }, written, 6);
  check('§3 the producer READS the population and mutates none of it', JSON.stringify(written) === before);
}

// ═════ §4 the real story — six committed births fan a real square ════════════
console.log('----- §4 six real doors on one square: the fan the person counts -----');
{
  const host = invokePrimitive('square', 401);
  const parentHome = [0, 0, 0];
  const target = { shape: host.shape, home: parentHome };
  const ops = ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue-mobius', 'collapse-sphere', 'dual'];
  const written = [{ form: host.form ?? host, home: [-20, 0, 0] }];
  let seq = 402;
  let born = 0;
  for (const opId of ops) {
    const result = applyPlaygroundOperationTo(opId, host.shape, null, seq, 24, [], null);
    seq += 1;
    if (!result.ok) {
      note(`door ${opId} refused: ${result.reason}`);
      continue;
    }
    born += 1;
    written.push({ form: result.born, home: spawnHomeForBirth(target, written, 6) });
  }
  check(`§4 the committed doors birthed ≥ 5 children on one square (real ops, no fixture) — got ${born}`, born >= 5);
  const childHomes = written.filter((w) => w.form.parentShape?.id === host.shape.id).map((w) => w.home);
  check('§4 every birth carried the REAL parentShape — the producer saw every sibling', childHomes.length === born);
  const { minDist, minAngleGap } = layReport(parentHome, childHomes);
  check(`§4 ★★ THE COUNT IS TRUE AT REST: ${born} children, pairwise ≥ clearance, edge angles distinct ≥ 8°`, minDist >= FAN.clearance - 1e-9 && minAngleGap >= 8 - 1e-9);
  note(`homes ${childHomes.map((h) => `(${h[0].toFixed(1)},${h[1].toFixed(1)})`).join(' ')}`);
  note(`minDist ${minDist.toFixed(2)} · minAngleGap ${minAngleGap.toFixed(2)}°`);
}

console.log(`\n${failures === 0 ? 'CLEAN' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

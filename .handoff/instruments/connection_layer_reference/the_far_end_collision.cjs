#!/usr/bin/env node
// THE FAR-END COLLISION — a probe of the researcher seat (2026-09-26), for the mothership's question 1 of 18:20 on ADR 0031 §9.2:
// the coder's rule "IS's implicit bar is on the path's OWN x alone" (src/lib/sorting.ts, read off the stone; F4 forced it).
//
// THE QUESTION. A path a → x → b through the view Φ on F–T composes to (IS, a, b). The stone (spaceOf.ts `feetOf`) reads it per a
// of the FIRST parent against a's own partner: FIX · DISAGREEMENT (a paired elsewhere) · PROPOSAL (a unpaired) · UND — it never
// looks at b. So a PROPOSAL whose b is already paired with another a′ (a COLLISION — the pairing the light proposes is one the
// register refuses at the act) reads the same as a free proposal. Under IS's one-to-one law the entry (IS, a, b) is barred by
// a′ ≡ b as much as by a ≡ b′; D7 says a path composing to a barred entry is a TENSION.
//
// MEASURED on the stone witness's 42 hand triples (F · T · Φ, the constants read verbatim from scripts/diagnose-the-stone.cjs
// exactly as the B3 witness reads them), the view Φ on F–T and its MIRROR (Φ on T–F, from T's roles):
//   (1) the stone's census on F–T (positive control: must equal the B3 witness's {UND 497 · PRO 46 · DIS 39 · FIX 6});
//   (2) PROPOSALs split: FREE (b unpaired on F–T) vs TAKEN (b paired with another a′ — the collision);
//       DISAGREEMENTs split: SINGLE (foot's b unpaired) vs DOUBLE (foot's b paired with another a′);
//   (3) the mirror's DISAGREEMENTs, predicted = TAKEN + DOUBLE, and the mirror's TAKEN, predicted = SINGLE (the geometry: a
//       collision seen from b IS a disagreement at b, since IS is symmetric and one-to-one on every edge);
//   (4) the coder's sorting: its TENSIONs on F–T = DIS (control), and in the mirror orientation = the mirror's DIS;
//   (5) FALSE COHERENT: triples the built reading (one orientation, source-side bar) calls coherent while a collision stands.
// SEALS, stated before the run: S1 census = the witness's; S2 built tensions = DIS per triple; S3 mirror DIS = TAKEN + DOUBLE
// per triple; S4 mirror TAKEN = SINGLE per triple; S5 built mirror tensions = mirror DIS per triple. The counts are derived here,
// never typed; the RESULTS file beside this instrument is its run.
//
// Run from the repo root: node .handoff/instruments/connection_layer_reference/the_far_end_collision.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const seal = (name, ok, detail) => { console.log(`${ok ? 'HELD' : 'BROKE'}  ${name}${detail ? `\n        ${detail}` : ''}`); if (!ok) failures += 1; };
const line = (t) => console.log(`      · ${t}`);

const SO = req('src/lib/sorting.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json');
const inv = (m) => { const o = new Map(); for (const [k, v] of m) o.set(v, k); return o; };
const comp = (g, f) => { const o = new Map(); for (const [x, y] of f) if (g.has(y)) o.set(x, g.get(y)); return o; };
const toMap = (o) => new Map(Object.entries(o));
const isOf = (m) => [...m].map(([x, y]) => ['IS', x, y, '+']);

const stoneSrc = readLf('scripts/diagnose-the-stone.cjs');
const constOf = (name) => { const m = stoneSrc.match(new RegExp(`^const ${name} = (.*);$`, 'm')); if (!m) throw new Error(`${name} not found in the stone witness`); return new Function(`return ${m[1]}`)(); };
const HAND_TF = constOf('HAND_TF'); const HAND_TP = constOf('HAND_TP'); const J_FP = constOf('J_FP');
const flowRoles = flow.roles.map((r) => r.id);
const tRoles = tcell.roles.map((r) => r.id);

// the stone's reading per a of A against J_AB, plus the split by the target's state on A–B
const readSide = (J_AB, J_AX, J_XB, A_roles) => {
  const foot = comp(J_XB, J_AX);
  const back = inv(J_AB); // b ↦ the a′ paired with it
  const out = { UND: 0, FIX: 0, DIS: 0, PRO: 0, PRO_FREE: 0, PRO_TAKEN: 0, DIS_SINGLE: 0, DIS_DOUBLE: 0, collisions: [] };
  for (const a of A_roles) {
    if (!foot.has(a)) { out.UND += 1; continue; }
    const b = foot.get(a);
    const takenByOther = back.has(b) && back.get(b) !== a;
    if (J_AB.get(a) === b) out.FIX += 1;
    else if (J_AB.has(a)) { out.DIS += 1; if (takenByOther) out.DIS_DOUBLE += 1; else out.DIS_SINGLE += 1; }
    else { out.PRO += 1; if (takenByOther) { out.PRO_TAKEN += 1; out.collisions.push([a, b, back.get(b)]); } else out.PRO_FREE += 1; }
  }
  return out;
};

const triples = [];
for (const tf of Object.keys(HAND_TF)) for (const tp of Object.keys(HAND_TP)) for (const fp of Object.keys(J_FP)) triples.push({ tf, tp, fp });

const census = { UND: 0, FIX: 0, DIS: 0, PRO: 0 };
const tot = { PRO_FREE: 0, PRO_TAKEN: 0, DIS_SINGLE: 0, DIS_DOUBLE: 0, mDIS: 0, mPRO: 0, mPRO_TAKEN: 0, mFIX: 0, mUND: 0 };
let s2 = 0, s3 = 0, s4 = 0, s5 = 0;
let falseCoherent = 0, coherentBuilt = 0, coherentBoth = 0, withCollision = 0, fullTension = 0, fullLight = 0;
const examples = [];
for (const { tf, tp, fp } of triples) {
  const J_FT = inv(toMap(HAND_TF[tf])); const J_TP = toMap(HAND_TP[tp]); const J_PF = inv(toMap(J_FP[fp]));
  const J_FP_ = inv(J_PF); const J_PT = inv(J_TP); const J_TF = inv(J_FT);
  const side = readSide(J_FT, J_FP_, J_PT, flowRoles);       // Φ on F–T, from F's roles (the stone's direction)
  const mirror = readSide(J_TF, J_TP, J_PF, tRoles);          // Φ on T–F, from T's roles (the mirror)
  for (const k of ['UND', 'FIX', 'DIS', 'PRO']) census[k] += side[k];
  tot.PRO_FREE += side.PRO_FREE; tot.PRO_TAKEN += side.PRO_TAKEN; tot.DIS_SINGLE += side.DIS_SINGLE; tot.DIS_DOUBLE += side.DIS_DOUBLE;
  tot.mDIS += mirror.DIS; tot.mPRO += mirror.PRO; tot.mPRO_TAKEN += mirror.PRO_TAKEN; tot.mFIX += mirror.FIX; tot.mUND += mirror.UND;
  const built = SO.sortFromRecords(['F', 'T'], isOf(J_FT), [{ view: 'P', faceId: 'f', xz: isOf(J_FP_), zy: isOf(J_PT), triads: [], verdicts: [] }], []);
  const builtM = SO.sortFromRecords(['T', 'F'], isOf(J_TF), [{ view: 'P', faceId: 'f', xz: isOf(J_TP), zy: isOf(J_PF), triads: [], verdicts: [] }], []);
  if (built.views[0].tensions.length !== side.DIS) s2 += 1;
  if (mirror.DIS !== side.PRO_TAKEN + side.DIS_DOUBLE) s3 += 1;
  if (mirror.PRO_TAKEN !== side.DIS_SINGLE) s4 += 1;
  if (builtM.views[0].tensions.length !== mirror.DIS) s5 += 1;
  if (side.PRO_TAKEN > 0) withCollision += 1;
  if (built.coherent) coherentBuilt += 1;
  if (built.coherent && builtM.coherent) coherentBoth += 1;
  if (built.coherent && side.PRO_TAKEN > 0) { falseCoherent += 1; if (examples.length < 3) examples.push({ tf, tp, fp, collisions: side.collisions.slice(0, 3) }); }
  fullTension += side.DIS + side.PRO_TAKEN; fullLight += side.PRO_FREE;
}

console.log('THE FAR-END COLLISION — the researcher\'s probe on the 42 hand triples (F · T · Φ), the view Φ on F–T and its mirror\n');
seal('S1 the stone\'s census on F–T equals the B3 witness\'s {UND 497 · PRO 46 · DIS 39 · FIX 6} (positive control: this reference is that reference)', triples.length === 42 && J(census) === J({ UND: 497, FIX: 6, DIS: 39, PRO: 46 }), J({ triples: triples.length, census }));
seal('S2 the coder\'s sorting on F–T reads exactly the stone\'s DISAGREEMENTs as TENSIONs, per triple (control: source-side bar = the stone)', s2 === 0, `mismatching triples: ${s2}`);
seal('S3 the mirror\'s DISAGREEMENTs = the F-side PROPOSALs whose b is taken + the F-side DISAGREEMENTs whose b is taken, per triple (a collision seen from b is a disagreement at b)', s3 === 0, `mismatching triples: ${s3}`);
seal('S4 the mirror\'s taken PROPOSALs = the F-side single DISAGREEMENTs, per triple (the same identity, the other way)', s4 === 0, `mismatching triples: ${s4}`);
seal('S5 the coder\'s sorting in the mirror orientation reads the mirror\'s DISAGREEMENTs as TENSIONs, per triple', s5 === 0, `mismatching triples: ${s5}`);
console.log('');
line(`PROPOSALs on F–T: ${census.PRO} = FREE ${tot.PRO_FREE} + TAKEN (collision) ${tot.PRO_TAKEN}`);
line(`DISAGREEMENTs on F–T: ${census.DIS} = SINGLE ${tot.DIS_SINGLE} + DOUBLE ${tot.DIS_DOUBLE}`);
line(`the mirror (Φ on T–F, from T's ${tRoles.length} roles): FIX ${tot.mFIX} · DIS ${tot.mDIS} · PRO ${tot.mPRO} (taken ${tot.mPRO_TAKEN}) · UND ${tot.mUND}`);
line(`under the full one-to-one law (a path composing to (IS, a, b) is a TENSION when a OR b is paired elsewhere): TENSION ${fullTension} · LIGHT ${fullLight} of ${census.DIS + census.PRO} non-FIX paths`);
line(`triples with at least one collision: ${withCollision} of ${triples.length}`);
line(`triples the built reading calls COHERENT: ${coherentBuilt}; of these, with a collision standing (FALSE COHERENT): ${falseCoherent}; coherent in both orientations: ${coherentBoth}`);
for (const ex of examples) line(`example ${ex.tf}·${ex.tp}·${ex.fp}: ${ex.collisions.map(([a, b, a2]) => `${a} → Φ → ${b}, but ${b} is ${a2}'s`).join('; ')}`);
console.log(`\n${failures === 0 ? 'ALL SEALS HELD' : `${failures} SEAL(S) BROKE`}`);
process.exit(failures === 0 ? 0 : 1);

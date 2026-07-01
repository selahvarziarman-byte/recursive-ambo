#!/usr/bin/env node

// DIAGNOSTIC — the REFINED M1a-v2 gate for the connection-modulated DIRECTOR-FIELD render
// (ADR 0017, researcher-ruled). The M1a-v1 finding STANDS and is the floor: a pure Q-field
// (n₀) is correctly w₁-BLIND. This gate tests the connection layer `n = R(α)·n₀` that the ½
// actually lives in, via the researcher's FOUR gauge-invariant, falsifiable criteria:
//   (1) LINKING HOLONOMY === committed w₁  — measured FROM THE FIELD (track n round a loop
//       linking the disclination), compared to the committed windingSign (−1). Never set to it.
//   (2) STRENGTH ½ — the connection modulates n₀ by a π half-turn (the disclination), not 0/full.
//   (3) ABSENT on w₁=0 (THE DISCRIMINATOR) — on the committed `control` self-glue (Σ vacuous ⇒
//       holonomy 0 ⇒ α≡0) the field === n₀ (the twist vanishes).
//   (4) Σ-REPRESENTATIVE-INVARIANT — move the cut (branch phase + core position) among
//       homologous representatives ⇒ same verdict (holonomy −1, strength ½). The physics is the
//       linking pairing, NOT the absolute locus.
//
// Through the REAL committed modules (anti-mock = the .ts transpile hook). Derive-only anchors
// (A1–A5) MUST hold; the 4 criteria are the hypothesis. PASS iff anchors sound + meter calibrated
// + all 4 criteria. A NOT-PASSED is a surfaced finding (which criterion; geometric realization vs
// ruling), routed back — not an instrument failure.

const fs = require('node:fs');
const path = require('node:path');
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
const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const field = req('src/selectors/directorFieldV0.ts');
const bridge = req('src/selectors/witnessBridge.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildSelfGlueSeed, runCascade, certifyCascadeOrientation } = req('src/lib/cascadeDriver.ts');
const { faceEdgePairs } = req('src/lib/surfaceOperations.ts');
const frame = req('src/lib/s4FrameWitnessV0.ts');
const inst = req('src/lib/connectionWaveInstrumentV0.ts');

let anchorFailures = 0;
function anchor(label, ok) { console.log(`${ok ? 'PASS' : 'FAIL'} - ${label}`); if (!ok) anchorFailures += 1; }
const note = (m) => console.log(`  ↳ ${m}`);
const measured = (label, ok, detail) => console.log(`  ${ok ? '✓ as-required' : '✗ NOT as-required'} — ${label}${detail ? `  [${detail}]` : ''}`);

// ── vector helpers ───────────────────────────────────────────────────────────────────────
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function framePerp(d) { d = nrm(d); const t = Math.abs(d[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; const u = nrm(cross(d, t)); const v = nrm(cross(d, u)); return { u, v }; }

console.log('director-field M1a-v2 gate: does n=R(α)·n₀ realize the committed w₁ (linking holonomy · strength ½ · absent on control · representative-invariant)?\n');

// ═══════════════════════════════════════════════════════════════════════════════════════════
// substrate — the flip render-state + the connection-modulated field
// ═══════════════════════════════════════════════════════════════════════════════════════════
const rs = bridge.buildKnownSeamRenderState();
const rsSnapshot = JSON.stringify(rs);
const sites = field.directorSitesFromRenderState(rs);
const flipField = field.connectionFieldFromRenderState(rs); // corePoint default = origin, cutPhase 0
const coreAxis = flipField.coreAxis;
const seamKeys = rs.seamEdges.map((e) => [rs.sites.find((s) => s.siteId === e.a)?.siteKey, rs.sites.find((s) => s.siteId === e.b)?.siteKey].sort());

// ═══════════════════════════════════════════════════════════════════════════════════════════
// [A] DERIVE-ONLY ANCHORS — the instrument + construction are sound
// ═══════════════════════════════════════════════════════════════════════════════════════════
console.log('----- [A] derive-only anchors -----');

// A1 — n₀ floor exact at the nodes (the connection MODULATES this committed-anchored floor).
let exactAtNodes = true;
for (const s of sites) { const r = field.directorAt(s.position, sites); if (Math.abs(dot(nrm(r.director), s.director)) < 1 - 1e-6 || r.topGap < 1 - 1e-6) exactAtNodes = false; }
anchor('A1 n₀ floor exact at nodes — directorAt(site)===n_site, topGap=1', exactAtNodes);

// A2 — the bridge EXPOSES the committed seam {bd,cd} + Σ=PD(φ) (the v2 exposure).
const sigmaExposed = Array.isArray(rs.sigmaClass) && rs.sigmaClass.length > 0 && Array.isArray(rs.sigmaChainEdges) && rs.sigmaChainEdges.length > 0 && Array.isArray(rs.edgeSigns) && rs.edgeSigns.length === 6;
anchor('A2 bridge exposes committed seam {bd,cd} + Σ=PD(φ) (sigmaClass/sigmaChainEdges/edgeSigns)', seamKeys.length === 1 && eq(seamKeys[0], ['bd', 'cd']) && sigmaExposed);
note(`sigmaClass=${JSON.stringify(rs.sigmaClass)} sigmaChainEdges=${JSON.stringify(rs.sigmaChainEdges)} edgeSigns=${JSON.stringify(rs.edgeSigns)} windingSign=${rs.windingSign}`);

// A3 — directorFieldV0 reads ONLY the committed bridge; recomputes no engine math.
const srcField = fs.readFileSync(path.join(repoRoot, 'src/selectors/directorFieldV0.ts'), 'utf8');
const codeOnly = srcField.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const readsBridge = /from '\.\/witnessBridge'/.test(codeOnly);
const reimplementsMath = /\bnullspace\b/.test(codeOnly) || /\bbuildFlatConnection\b/.test(codeOnly) || /\banalyzeGlobalW1\b/.test(codeOnly) || /\bpoincareDualClass\b/.test(codeOnly) || /\btransportDirector\b/.test(codeOnly) || /function\s+\w*[wW]1\w*\s*\(/.test(codeOnly);
anchor('A3 sampler reads the committed bridge exposure only; re-implements NO engine math (no w₁/gauge/Σ recompute)', readsBridge && !reimplementsMath);

// A4 — derive-only guard.
anchor('A4 derive-only: committed render-state byte-identical after all sampling', JSON.stringify(rs) === rsSnapshot);

// A5 — the committed-derived construction parameters: H(flip)=1, core axis = dir(bd)×dir(cd).
const H_flip = field.committedHolonomy(rs.sigmaClass, rs.windingSign);
const bd = sites.find((s) => s.siteKey === 'bd'), cd = sites.find((s) => s.siteKey === 'cd');
const axisExpected = nrm(cross(bd.director, cd.director));
anchor('A5 committed-derived params: holonomy(flip)=1 (Σ nontrivial ∧ ∏U=−1); coreAxis = dir(bd)×dir(cd)', H_flip === 1 && eq(coreAxis.map((x) => +x.toFixed(6)), axisExpected.map((x) => +x.toFixed(6))));
note(`H_flip=${H_flip}  coreAxis=${JSON.stringify(coreAxis.map((x) => +x.toFixed(3)))} = dir(bd)${JSON.stringify(bd.director)}×dir(cd)${JSON.stringify(cd.director)}`);

// ═══════════════════════════════════════════════════════════════════════════════════════════
// [B0] WINDING-METER calibration (a known +½ defect → +0.5)
// ═══════════════════════════════════════════════════════════════════════════════════════════
function windingStrength(dirAt, center, axisHint, radius, N = 720, startPhase = 0) {
  const { u, v } = framePerp(axisHint);
  let prev = null, total = 0;
  for (let k = 0; k <= N; k += 1) {
    const th = startPhase + (2 * Math.PI * k) / N;
    const p = add(center, add(mul(u, radius * Math.cos(th)), mul(v, radius * Math.sin(th))));
    const d = dirAt(p);
    let ang = Math.atan2(dot(d, v), dot(d, u)) % Math.PI;
    if (ang > Math.PI / 2) ang -= Math.PI; if (ang <= -Math.PI / 2) ang += Math.PI;
    if (prev === null) { prev = ang; continue; }
    let dl = ang - prev; while (dl > Math.PI / 2) dl -= Math.PI; while (dl < -Math.PI / 2) dl += Math.PI;
    total += dl; prev = ang;
  }
  return total / (2 * Math.PI);
}
const halfDefectDir = (p) => { const phi = Math.atan2(p[1], p[0]); return [Math.cos(phi / 2), Math.sin(phi / 2), 0]; };
const calib = windingStrength(halfDefectDir, [0, 0, 0], [0, 0, 1], 1.0);
const meterSound = Math.abs(calib - 0.5) < 0.02;
anchor(`B0 winding-meter calibration on a known +½ defect reads ≈ +0.5 (got ${calib.toFixed(3)})`, meterSound);

// ═══════════════════════════════════════════════════════════════════════════════════════════
// build the engine-grounded CONTROL field (w₁=0 self-glue ⇒ Σ vacuous ⇒ holonomy 0 ⇒ n≡n₀)
// ═══════════════════════════════════════════════════════════════════════════════════════════
const T = createSeedShape('tetrahedron');
const F0 = applyAmboDissection(T);
const midpointSet = new Set(Object.values(F0.vertices).filter((v) => v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2).map((v) => v.id));
const intrinsicFace = F0.faces.filter((f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => midpointSet.has(v)))[0];
const edgeKey = (u, v) => [u, v].sort((a, b) => a.localeCompare(b)).join('|');
const edgeByKey = new Map(); for (const e of F0.edges) edgeByKey.set(edgeKey(e.vertexIds[0], e.vertexIds[1]), e);
function assembledFromCascade(face, mode) {
  const trace = runCascade(F0, [face], buildSelfGlueSeed(F0, face, mode));
  const repOf = (cs, id) => { for (const c of cs) if (c.includes(id)) return c[0]; return id; };
  const vClass = (v) => repOf(trace.partition[0], v); const eClass = (e) => repOf(trace.partition[1], e);
  const edges = trace.partition[1].map((c) => { const r = F0.edges.find((e) => e.id === c[0]); return { id: c[0], u: vClass(r.vertexIds[0]), v: vClass(r.vertexIds[1]) }; });
  const boundary = faceEdgePairs(face).map(([from, to]) => { const r = edgeByKey.get(edgeKey(from, to)); const cid = eClass(r.id); const ae = edges.find((e) => e.id === cid); return { edge: cid, dir: ae.u === vClass(from) && ae.v === vClass(to) ? 1 : -1 }; });
  return { vertices: [...new Set(face.vertexIds.map(vClass))], edges, faces: [{ boundary }] };
}
const controlComplex = assembledFromCascade(intrinsicFace, 'control');
const controlW1 = analyzeGlobalW1(controlComplex);
const controlSigma = frame.poincareDualClass(controlComplex, controlW1.debug.basisCycles, controlW1.debug.perCycleW1);
const controlCascadeW1 = certifyCascadeOrientation(F0, [intrinsicFace], runCascade(F0, [intrinsicFace], buildSelfGlueSeed(F0, intrinsicFace, 'control'))).w1;
const controlWinding = frame.runFrameWitness(inst.cycleGraph(6), controlW1.debug.perCycleW1, [0, 1, 2, 3, 4, 5]).winding.windingSign;
const H_control = field.committedHolonomy(controlSigma.sigmaClass, controlWinding);
const controlField = field.buildConnectionField(sites, { holonomy: H_control, coreAxis, corePoint: [0, 0, 0] });

// ═══════════════════════════════════════════════════════════════════════════════════════════
// measurement helpers on a loop LINKING the core (⟂ coreAxis, centred at corePoint+off·coreAxis)
// ═══════════════════════════════════════════════════════════════════════════════════════════
// holonomy: track the field VECTOR continuously round the loop; n_end·n_start sign (start placed
// OPPOSITE the branch cut to avoid the discontinuity). modulation strength: how much R(α) rotated
// n relative to n₀, lifted (the half-turn), via the meter in the local (n₀, axis×n₀) rotation frame.
function loopMeasure(field2, off, R, cutPhase, N = 2000) {
  const { u, v } = framePerp(coreAxis);
  const ctr = add(field2.corePoint, mul(coreAxis, off));
  const start = cutPhase + Math.PI; // opposite the cut
  let pv = null, first = null, minGap = Infinity, prevA = null, modTot = 0, maxAng = 0;
  for (let k = 0; k <= N; k += 1) {
    const ph = start + (2 * Math.PI * k) / N;
    const p = add(ctr, add(mul(u, R * Math.cos(ph)), mul(v, R * Math.sin(ph))));
    const sample = field2.sampleDirector(p);
    minGap = Math.min(minGap, sample.topGap);
    let vec = sample.director;
    if (pv && dot(vec, pv) < 0) vec = mul(vec, -1);
    if (first === null) first = vec; pv = vec;
    // modulation: n in the (n0, axis×n0) rotation frame
    const n0 = sample.n0; let ax = cross(n0, coreAxis); if (Math.hypot(...ax) < 1e-6) ax = cross(n0, u); ax = nrm(ax);
    const e2 = cross(ax, n0);
    let a = Math.atan2(dot(sample.director, e2), dot(sample.director, n0)) % Math.PI;
    if (a > Math.PI / 2) a -= Math.PI; if (a <= -Math.PI / 2) a += Math.PI;
    const lineAng = Math.acos(Math.max(-1, Math.min(1, Math.abs(dot(nrm(sample.director), n0))))); maxAng = Math.max(maxAng, lineAng);
    if (prevA !== null) { let dl = a - prevA; while (dl > Math.PI / 2) dl -= Math.PI; while (dl < -Math.PI / 2) dl += Math.PI; modTot += dl; }
    prevA = a;
  }
  return { holo: dot(pv, first), modStrength: modTot / (2 * Math.PI), maxLineAngleDeg: (maxAng * 180) / Math.PI, minGap };
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// [C] THE FOUR RESEARCHER CRITERIA
// ═══════════════════════════════════════════════════════════════════════════════════════════
console.log('\n----- [B] the M1a-v2 hypothesis (the researcher\'s 4 criteria) -----');

// C1 — LINKING HOLONOMY === committed w₁ (measured from the field; control gives the n₀ baseline).
const c1Loops = [{ off: 0.3, R: 0.4 }, { off: 0.5, R: 0.3 }, { off: -0.3, R: 0.4 }];
const c1 = c1Loops.map((L) => ({ L, f: loopMeasure(flipField, L.off, L.R, 0), c: loopMeasure(controlField, L.off, L.R, 0) }));
const flipHoloAllMinus1 = c1.every((x) => x.f.holo < -0.9);
const ctrlHoloAllPlus1 = c1.every((x) => x.c.holo > 0.9);
const matchesCommitted = flipHoloAllMinus1 && rs.windingSign === -1; // measured −1 === committed windingSign
console.log('\n  C1 LINKING HOLONOMY === committed w₁ (measured from the field; w₁-tie via C3 — see SCOPE)');
for (const x of c1) note(`loop(off=${x.L.off},R=${x.L.R}): flip n-holonomy=${x.f.holo.toFixed(2)}  control n-holonomy=${x.c.holo.toFixed(2)}`);
note(`committed windingSign (the target, NOT assigned) = ${rs.windingSign}`);
note('SCOPE: holonomy is measured from the field (catches a wrong axis / full turn → +1), but for this');
note('construction family the −1 VALUE is entailed by the committed holonomy boolean (nematic holonomy is');
note('ℤ/2, sense-blind) — so C1\'s w₁-TIE is shared with C3, not an independent certification.');
measured('the field\'s linking holonomy === committed w₁ = −1 (control baseline +1 ⇒ the −1 is the connection)', matchesCommitted && ctrlHoloAllPlus1, matchesCommitted && ctrlHoloAllPlus1 ? 'measured −1 === committed −1' : 'mismatch');

// C2 — STRENGTH ½ (the π half-turn the connection adds; not 0/full).
const s = loopMeasure(flipField, 0.3, 0.4, 0); const sc = loopMeasure(controlField, 0.3, 0.4, 0);
const halfTurnFlip = Math.abs(Math.abs(s.modStrength) - 0.5) < 0.06; const noTurnControl = Math.abs(sc.modStrength) < 0.06;
console.log('\n  C2 STRENGTH ½ (the connection modulates n₀ by a π half-turn)');
note(`modulation strength: flip=${s.modStrength.toFixed(3)} control=${sc.modStrength.toFixed(3)} (½ vs 0)`);
note(`max director reorientation vs n₀ on the loop: flip=${s.maxLineAngleDeg.toFixed(1)}° (≈90° ⇒ a real half-turn) control=${sc.maxLineAngleDeg.toFixed(1)}°`);
measured('the connection adds a stable ½ (π half-turn) on flip, 0 on control', halfTurnFlip && noTurnControl && s.maxLineAngleDeg > 80, halfTurnFlip && noTurnControl ? 'clean ½ modulation' : 'not ½');

// C3 — ABSENT on w₁=0 (the discriminator): control field === n₀ everywhere.
let maxCtrlDiff = 0;
for (let i = 0; i < 600; i += 1) {
  const th = (i * 2.3999632) % (2 * Math.PI); const z = 1 - (2 * (i + 0.5)) / 600; const rr = Math.sqrt(Math.max(0, 1 - z * z));
  for (const sc2 of [0.5, 0.85, 1.0]) {
    const p = [sc2 * rr * Math.cos(th), sc2 * rr * Math.sin(th), sc2 * z];
    const a = controlField.sampleDirector(p).director; const b = controlField.n0At(p);
    maxCtrlDiff = Math.max(maxCtrlDiff, Math.min(Math.hypot(...sub(a, b)), Math.hypot(...add(a, b))));
  }
}
console.log('\n  C3 ABSENT on w₁=0 (the committed control self-glue ⇒ Σ vacuous ⇒ holonomy 0)');
note(`control: cascadeW1=${controlCascadeW1} Σ.sigmaClass=${JSON.stringify(controlSigma.sigmaClass)} windingSign=${controlWinding} ⇒ committedHolonomy=${H_control}`);
note(`max |control field − n₀| over 1800 pts = ${maxCtrlDiff.toExponential(2)} (0 ⇒ the twist VANISHES; field is exactly the n₀ floor)`);
measured('on w₁=0 the field === n₀ (the twist vanishes — the discriminator the fake fails)', H_control === 0 && maxCtrlDiff < 1e-9, H_control === 0 && maxCtrlDiff < 1e-9 ? 'vanishes' : 'present');

// C4 — Σ-REPRESENTATIVE-INVARIANT: vary cut phase + core position (homologous) ⇒ same verdict.
console.log('\n  C4 CUT-LOCUS-INVARIANT (move the FREE cut locus — corePoint/cutPhase — the gauge freedom)');
note('SCOPE: this varies the field\'s OWN free locus params. The committed sigmaChainEdges is');
note('combinatorial-only (RM-spoke ids on the 1-vertex glued complex — NOT embeddable on the');
note('octahedron), so the geometric locus is inherently a free representative. This is a gauge-');
note('invariance check, NOT invariance across embeddable committed Σ-representatives.');
const reps = [
  { tag: 'cutPhase=0', f: flipField },
  { tag: 'cutPhase=2.0', f: field.connectionFieldFromRenderState(rs, { cutPhase: 2.0 }) },
  { tag: 'cutPhase=4.5', f: field.connectionFieldFromRenderState(rs, { cutPhase: 4.5 }) },
  { tag: 'corePoint=(0.12,0.08,0)', f: field.connectionFieldFromRenderState(rs, { corePoint: [0.12, 0.08, 0] }) },
  { tag: 'corePoint=(-0.1,0.05,0)', f: field.connectionFieldFromRenderState(rs, { corePoint: [-0.1, 0.05, 0] }) },
];
let repInvariant = true;
for (const r of reps) {
  const m = loopMeasure(r.f, 0.3, 0.4, r.f.cutPhase);
  const ok = m.holo < -0.9 && Math.abs(Math.abs(m.modStrength) - 0.5) < 0.08;
  if (!ok) repInvariant = false;
  note(`${r.tag.padEnd(26)} holonomy=${m.holo.toFixed(2)} modStrength=${m.modStrength.toFixed(3)}  ${ok ? 'OK' : 'DIVERGES'}`);
}
measured('holonomy −1 + strength ½ invariant under the free cut locus (corePoint/cutPhase = gauge)', repInvariant, repInvariant ? 'invariant' : 'representative-dependent');

// ═══════════════════════════════════════════════════════════════════════════════════════════
// VERDICT
// ═══════════════════════════════════════════════════════════════════════════════════════════
const c1ok = matchesCommitted && ctrlHoloAllPlus1;
const c2ok = halfTurnFlip && noTurnControl && s.maxLineAngleDeg > 80;
const c3ok = H_control === 0 && maxCtrlDiff < 1e-9;
const c4ok = repInvariant;
const gatePassed = c1ok && c2ok && c3ok && c4ok;
console.log('\n===========================================================================');
if (anchorFailures > 0 || !meterSound) {
  console.log(`INSTRUMENT UNSOUND — ${anchorFailures} anchor failure(s)${meterSound ? '' : ' + meter mis-calibrated'}. Fix before trusting the verdict.`);
} else {
  console.log('ANCHORS: all sound (n₀ exact at nodes · bridge exposes Σ · reads bridge only · byte-safe · committed-derived params). WINDING METER: calibrated.');
  console.log('');
  console.log(`  C1 linking holonomy === committed w₁ : ${c1ok ? 'PASS' : 'FAIL'}`);
  console.log(`  C2 strength ½ (π half-turn)          : ${c2ok ? 'PASS' : 'FAIL'}`);
  console.log(`  C3 absent on w₁=0 (discriminator)    : ${c3ok ? 'PASS' : 'FAIL'}  ← load-bearing`);
  console.log(`  C4 cut-locus-invariant (gauge)       : ${c4ok ? 'PASS' : 'FAIL'}`);
  console.log('');
  console.log(`M1a-v2 GATE: ${gatePassed ? 'PASSED — the connection realizes the committed w₁; M1b (the LIC surface) is unblocked' : 'NOT PASSED — STOP and surface (which criterion; geometric realization vs ruling)'}`);
  console.log('');
  console.log('SCOPE OF THE PASS (honest, per adversarial audit): the load-bearing certifications are');
  console.log('  A5 (axis pinned to committed dir(bd)×dir(cd)) + C2 (a ½ half-turn, not full/none) +');
  console.log('  C3 (the half-turn is gated by the committed w₁ boolean — vanishes on the control; the');
  console.log('  un-riggeable discriminator the forbidden fake fails). C1 is a genuine measurement but');
  console.log('  its −1 is entailed by H (w₁-tie shared with C3); C4 tests the free cut-locus gauge.');
  console.log('  CERTIFIED: a committed-w₁-GATED π half-turn about the committed seam AXIS. The cut');
  console.log('  LOCUS is a free representative (committed Σ cut is combinatorial-only) — NOT pinned to');
  console.log('  the bd–cd seam. See REPORT_DIRECTOR_FIELD_M1a_V2.md for the open question to the office.');
}
console.log('===========================================================================');
// exit 0 iff the instrument is sound AND the gate verdict is PASS (honest CI signal); a sound
// instrument reporting NOT-PASSED exits 1 (gate not open — a surfaced finding, see the report).
process.exit(anchorFailures === 0 && meterSound && gatePassed ? 0 : 1);

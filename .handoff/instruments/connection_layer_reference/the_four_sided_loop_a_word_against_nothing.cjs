'use strict';
// READ-ONLY DIAGNOSTIC (ADR 0031 section 9.74; the researcher, 2026-10-21): the 29 loops of Virgin Land's 20:10 export (Metabolism, Consumption-Production), the page's reading of each, and the reading under the
// corrected rule (a word against nothing on a FOUR-sided diagonal is a refused route, counted empty for the state, as section 9.43 (1) counts it on a three-sided one).
const fs = require('node:fs'); const path = require('node:path'); const repoRoot = path.resolve(__dirname, '../../..'); const ts = require('node:module').createRequire(path.join(repoRoot, 'package.json'))('typescript');
const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts']; require.extensions['.css'] = () => {};
const req = (p) => require(path.join(repoRoot, p));
const { useGeometryStore, childRecordsOf } = req('src/store/geometryStore.ts');
const CL = req('src/lib/childLoops.ts');
const REC = process.argv[2];
const St = () => useGeometryStore.getState();
St().importWorkspace(JSON.parse(fs.readFileSync(REC, 'utf8')));
const shape = () => St().shapes[St().currentShapeId];
const byLabel = (l) => Object.keys(shape().vertices).find((v) => shape().vertices[v].data.label === l);
const C = byLabel('Consumption'), P = byLabel('Production');
const site = Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(C) && v.createdBy.sourceVertexIds.includes(P)).id;
const facts = () => ({ converses: St().converses, opaque: St().opaque });
const L = CL.childLoopsCached(shape(), site, childRecordsOf(St()));
const R = CL.loopRecordsFor(shape(), site, L, St().loopAnswers, St().loopRules, facts());
const P_ = (s) => console.log(s);
P_(`site ${site} (${shape().vertices[site].data.label}) · roles ${L.roles.length} · loops ${L.loops.length}`);
const val = (v) => v.value === undefined ? '?' : v.value === 0 ? 'NOTHING' : `"${v.value}"`;
const stateUnder = (readings) => readings.some((r) => r === 'differ') ? 'hole' : readings.some((r) => r === 'waits') ? 'waits' : readings.some((r) => r === 'agree') ? 'filled' : 'settled';
const page = { filled: 0, hole: 0, settled: 0, waits: 0, other: 0 }, corr = { filled: 0, hole: 0, settled: 0, waits: 0, other: 0 };
const changed = [];
for (const loop of L.loops) {
  const r = CL.loopReadingFor(L, loop, R);
  const ri = L.roles[loop.i], rj = L.roles[loop.j];
  const name = `${loop.kind}-sided (${ri.key} | ${rj.key})`;
  if (!r.diagonals.length) { P_(`${name}: ${r.state}`); page.other++; corr.other++; continue; }
  // the corrected diagonal readings: on a four-sided diagonal, a word against nothing is 'refused' (counted empty), never 'differ'
  const corrected = r.diagonals.map((d) => {
    if (loop.kind === 'four' && d.reading === 'differ') { const A = d.a.value, B = d.b.value; if ((typeof A === 'string' && B === 0) || (A === 0 && typeof B === 'string')) return 'refused'; }
    return d.reading;
  });
  const cs = stateUnder(corrected);
  (page[r.state] !== undefined ? page[r.state]++ : page.other++); (corr[cs] !== undefined ? corr[cs]++ : corr.other++);
  P_(`${name}: page ${r.state}${cs !== r.state ? `  ->  corrected ${cs}` : ''}`);
  r.diagonals.forEach((d, k) => P_(`    diagonal from ${d.start}: a=${val(d.a)} b=${val(d.b)} -> ${d.reading}${corrected[k] !== d.reading ? ` (corrected: ${corrected[k]})` : ''}${d.word ? ` word "${d.word}"` : ''}`));
  if (cs !== r.state) changed.push({ name, from: r.state, to: cs });
}
P_(''); P_(`PAGE: filled ${page.filled} · holes ${page.hole} · settled ${page.settled} · waits ${page.waits} · other ${page.other}`);
P_(`CORRECTED: filled ${corr.filled} · holes ${corr.hole} · settled ${corr.settled} · waits ${corr.waits} · other ${corr.other}`);
P_(`CHANGED (${changed.length}):`); changed.forEach((c) => P_(`  ${c.name}: ${c.from} -> ${c.to}`));
const two = ['four-sided (product is sold as spending | use is consumed as capacity)', 'four-sided (surplus is sold as spending | use is consumed as capacity)'];
P_(`SEAL S1 (VL's page counts 6/16/7): ${page.filled === 6 && page.hole === 16 && page.settled === 7 ? 'HELD' : 'FAILED'}`);
P_(`SEAL S2 (her two loops change hole -> filled): ${two.every((n) => changed.some((c) => c.name === n && c.from === 'hole' && c.to === 'filled')) ? 'HELD' : 'FAILED ' + JSON.stringify(changed.map((c) => c.name))}`);
// the relation KINDS (section 9.48): the kinds already named at the site, and the kind of each loop the correction fills
P_('');
P_(`relation kinds named at the site: ${St().relationNames.filter((r) => r[1] === site).map((r) => `${r[2]} -> "${r[3]}"`).join(' ; ')}`);
for (const loop of L.loops) {
  const r = CL.loopReadingFor(L, loop, R); if (loop.kind !== 'four' || r.state !== 'hole') continue;
  const corrected = r.diagonals.map((d) => (d.reading === 'differ' && ((typeof d.a.value === 'string' && d.b.value === 0) || (d.a.value === 0 && typeof d.b.value === 'string'))) ? 'refused' : d.reading);
  if (stateUnder(corrected) !== 'filled') continue;
  P_(`filled under the correction: (${L.roles[loop.i].key} | ${L.roles[loop.j].key}) -> kind ${CL.loopShapeOf(L, loop, false).key}`);
}

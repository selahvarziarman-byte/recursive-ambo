#!/usr/bin/env node
// THE STRIP'S LIGHTS — STAMP STRIP-LIGHTS (Arman's Δ257 ✔ VERBATIM "Build it now (Recommended)"; the mothership's 2026-10-30 11:56, claims §560; the
// designer's 10:52 form and her 11:45 order): at every child the strip lists EVERY light the record holds through its edge — the host cell's faces
// first, as before, then every light `altitudesAt` holds that they do not show, by the apex's generation, youngest first, ties in the record's
// order. One reader by construction: the lights are `altitudesAt`'s. MEASURED before the build at cfa97e7: the triangle's ABAC showed `BC's light`
// alone, the tetrahedron's ABAC two of three, Virgin Land's Accumulation–Class two of three (Production's unseen); the octahedron's generation-2
// medial child three buttons (a triangle's apex and a square's two corners) and the cube's children four square corners — kept, and a light added
// only where the record holds one the host's faces do not show.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { altitudesAt } = req('src/lib/altitude.ts');
const { midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { canonicalEdgeKey } = req('src/lib/ids.ts');

let failures = 0;
const J = (v) => JSON.stringify(v);
const check = (title, ok, detail) => { console.log(`${ok ? 'PASS' : 'FAIL'} - ${title}${ok ? '' : ` :: ${detail}`}`); if (!ok) failures += 1; };
const note = (s) => console.log(`note - ${s}`);
const label = (sh, id) => (sh.vertices[id] && sh.vertices[id].data.label) || id;

/** the site at a child, as the page builds it (the presenter's trace: the parents and the host — the parent cell whose face holds the edge) */
function siteAt(sh, v) {
  const [a, b] = v.createdBy.sourceVertexIds;
  const host = sh.cells.find((c) => c.kind === 'parent' && sh.faces.some((f) => c.faceIds.includes(f.id) && f.vertexIds.includes(a) && f.vertexIds.includes(b)));
  return { site: midpointSiteOf(sh, v.id, { parentIds: [a, b], hostCellId: host.id }), a, b };
}
const strip = (sh, site) => [...new Set(site.sources.flatMap((s) => s.apexes))].map((x) => label(sh, x));
const lights = (sh, site) => altitudesAt(sh, site.edge).map((l) => label(sh, l.apex));
const childBy = (sh, pick) => Object.values(sh.vertices).find((v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && pick(v));

// ─── §1 THE TRIANGLE ───
console.log('§1 THE TRIANGLE — ABAC lists BC\'s light then A\'s; a seed-edge child and an outer half-edge child as before');
const t1 = applyAmboDissection(createSeedShape('triangle'));
const t2 = applyAmboDissection(t1, t1.cells.find((c) => c.kind === 'core').id);
const tAB = siteAt(t1, childBy(t1, (v) => v.data.label === 'AB'));
check('§1 a seed-edge child (AB at generation 1): one light, C — as before', J(strip(t1, tAB.site)) === J(['C']), J(strip(t1, tAB.site)));
const tABAC = siteAt(t2, childBy(t2, (v) => v.data.label === 'ABAC'));
check("§1 THE ACCEPTANCE: ABAC reads `BC's light · A's light` — the host's (the core's face) first, then the parent corner's through residue A's face (one before this build)",
  J(strip(t2, tABAC.site)) === J(['BC', 'A']) && tABAC.site.sources.length === 2 && tABAC.site.sources[1].apexes.length === 1 && t2.cells.find((c) => c.kind === 'residue' && c.generationDepth === 1 && c.faceIds.includes(tABAC.site.sources[1].faceId)) !== undefined,
  J({ strip: strip(t2, tABAC.site), sources: tABAC.site.sources.map((s) => s.faceName) }));
const tres = t2.cells.find((c) => c.kind === 'residue' && c.generationDepth === 1);
const t3 = applyAmboDissection(t2, tres.id);
const outer = childBy(t3, (v) => v.createdBy.sourceVertexIds.some((x) => t3.vertices[x].createdBy.operation === 'seed') && v.createdBy.sourceVertexIds.some((x) => t3.vertices[x].createdBy.operation === 'ambo-dissection'));
const tOuter = siteAt(t3, outer);
check(`§1 an outer half-edge child (${label(t3, outer.id)} at generation 2): one light — as before`, strip(t3, tOuter.site).length === 1 && J(strip(t3, tOuter.site)) === J(lights(t3, tOuter.site)), J(strip(t3, tOuter.site)));

// ─── §2 THE TETRAHEDRON ───
console.log("§2 THE TETRAHEDRON — a generation-2 medial child reads three: the host's two, then the parent corner's");
const h1 = applyAmboDissection(createSeedShape('tetrahedron'));
const h2 = applyAmboDissection(h1, h1.cells.find((c) => c.kind === 'core').id);
const hAB = siteAt(h1, childBy(h1, (v) => v.data.label === 'AB'));
check('§2 a seed-edge child (AB): two lights, C and D — as before', J(strip(h1, hAB.site).sort()) === J(['C', 'D']) && hAB.site.sources.length === 2, J(strip(h1, hAB.site)));
const hABAC = siteAt(h2, childBy(h2, (v) => v.data.label === 'ABAC'));
check("§2 THE ACCEPTANCE: ABAC reads `BC's light · AD's light · A's light` — the host's two (as before, in the host's order), then the parent corner A through its residue's face (two before this build)",
  J(strip(h2, hABAC.site)) === J(['BC', 'AD', 'A']) && hABAC.site.sources.length === 3, J(strip(h2, hABAC.site)));
check('§2 one reader: the strip holds every light `altitudesAt` holds at ABAC, and nothing a face through the edge does not hold', J(strip(h2, hABAC.site).slice().sort()) === J(lights(h2, hABAC.site).sort()), J({ strip: strip(h2, hABAC.site), lights: lights(h2, hABAC.site) }));

// ─── §3 THE OCTAHEDRON AND THE CUBE ───
console.log("§3 THE OCTAHEDRON AND THE CUBE — a square's corners are kept as the person has had them; a light is added only where the record holds one");
const o0 = createSeedShape('octahedron'); const o1 = applyAmboDissection(o0, o0.cells.find((c) => c.kind === 'seed').id);
const o2 = applyAmboDissection(o1, o1.cells.find((c) => c.topology === 'cuboctahedron').id);
const oChild = childBy(o2, (v) => v.createdBy.sourceVertexIds.every((x) => x.startsWith('vertex:mid:')));
const oSite = siteAt(o2, oChild);
check(`§3 the octahedron's generation-2 medial child (${label(o2, oChild.id)}): the host's triangle's apex and its square's two corners as before, then the parent corner's light (three buttons before, four now)`,
  oSite.site.sources.length === 3 && strip(o2, oSite.site).length === 4 && lights(o2, oSite.site).every((l) => strip(o2, oSite.site).includes(l)) && oSite.site.sources[2].apexes.length === 1 && o2.vertices[oSite.site.sources[2].apexes[0]].createdBy.operation === 'seed',
  J({ strip: strip(o2, oSite.site), lights: lights(o2, oSite.site), sources: oSite.site.sources.map((s) => s.faceName) }));
const c0 = createSeedShape('cube'); const c1 = applyAmboDissection(c0, c0.cells.find((c) => c.kind === 'seed').id);
const cSite = siteAt(c1, childBy(c1, () => true));
check("§3 the cube's child: its two squares' four corners as before, and no light added (a square carries none by D28: `altitudesAt` holds nothing)", cSite.site.sources.length === 2 && strip(c1, cSite.site).length === 4 && lights(c1, cSite.site).length === 0, J(strip(c1, cSite.site)));

// ─── §4 VIRGIN LAND'S RECORD ───
console.log("§4 VIRGIN LAND'S 19:54 RECORD dissected again — Accumulation–Class gains Production's light");
const ws = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8'));
const g1 = Object.values(ws.shapes).find((s) => s.genealogy.generationDepth === 1);
const g2 = applyAmboDissection(g1, g1.cells.find((c) => c.kind === 'core').id);
const vSite = siteAt(g2, childBy(g2, (v) => v.data.label === 'Accumulation–Class'));
check("§4 THE ACCEPTANCE: Accumulation–Class reads `Finance–Distribution's light · Livelihood's light · Production's light` (the designer's reading; two before this build)",
  J(strip(g2, vSite.site)) === J(['Finance–Distribution', 'Livelihood', 'Production']), J(strip(g2, vSite.site)));
for (const sh of Object.values(ws.shapes)) {
  if (!sh.generations || sh.generations.length < 2) continue;
  const kids = Object.values(sh.vertices).filter((v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2);
  const same = kids.every((v) => { const s = siteAt(sh, v); return J(strip(sh, s.site).slice().sort()) === J(lights(sh, s.site).sort()); });
  check(`§4 on the record as saved (generation ${sh.genealogy.generationDepth}): every child's strip is exactly the record's lights (${kids.length} children) — as before`, same, 'a child differs');
}

// ─── §5 EVERY CHILD OF EVERY SHAPE: no light hidden ───
console.log('§5 BY CONSTRUCTION — at every child of every shape, every light `altitudesAt` holds is in the strip');
const shapes = [['triangle g1', t1], ['triangle g2', t2], ['triangle g2+', t3], ['tetrahedron g1', h1], ['tetrahedron g2', h2], ['octahedron g1', o1], ['octahedron g2', o2], ['cube g1', c1], ['19:54 g2', g2]];
let hidden = 0; let counted = 0;
for (const [, sh] of shapes) for (const v of Object.values(sh.vertices)) {
  if (!v.createdBy || v.createdBy.operation !== 'ambo-dissection' || v.createdBy.sourceVertexIds.length !== 2) continue;
  const [a, b] = v.createdBy.sourceVertexIds;
  if (!sh.edges.some((e) => canonicalEdgeKey(...e.vertexIds) === canonicalEdgeKey(a, b))) continue;
  const s = siteAt(sh, v); counted += 1;
  const shown = new Set(strip(sh, s.site));
  if (!lights(sh, s.site).every((l) => shown.has(l))) hidden += 1;
}
check(`§5 ${counted} children across nine shapes: none hides a light the record holds`, counted > 100 && hidden === 0, `hidden at ${hidden}`);

// ─── §6 THE ORDER: youngest apex first, ties in the record's order ───
console.log("§6 THE ORDER — after the host's lights, by the apex's generation, youngest first; ties keep the record's order");
{
  // a manufactured record: the triangle at generation 2 with a second light through AB–AC from a born corner of generation 2 (a face added by hand)
  const v = childBy(t2, (x) => x.data.label === 'ABAC'); const [a, b] = v.createdBy.sourceVertexIds;
  const xId = 'vertex:mid:manufactured'; const face = { id: 'face:manufactured', vertexIds: [a, b, xId], role: 'dissection-residue-face', lineage: t2.faces[0].lineage };
  const mut = { ...t2, vertices: { ...t2.vertices, [xId]: { ...t2.vertices[a], id: xId, data: { ...t2.vertices[a].data, label: 'X' } } }, faces: [...t2.faces, face], generations: [...t2.generations, { id: 'generation:manufactured', depth: 2, sourceOperation: 'ambo-dissection', parentShapeId: t2.id, parentCellIds: [], createdCellIds: [], createdVertexIds: [xId], createdAt: '' }] };
  const s = siteAt(mut, v);
  check("§6 a born corner (generation 2) before a seed corner: the strip reads `BC's light · X's light · A's light` — the host's first, then X (young), then A (old)", J(strip(mut, s.site)) === J(['BC', 'X', 'A']), J(strip(mut, s.site)));
  const mut0 = { ...mut, generations: mut.generations.map((g) => (g.id === 'generation:manufactured' ? { ...g, createdVertexIds: [] } : g)) }; // X of no generation reads 0, A's age: a tie keeps the record's order (A's face first in the record)
  const s0 = siteAt(mut0, v);
  check("§6 a tie keeps the record's order: X read as a seed corner stands after A (A's face is earlier in the record)", J(strip(mut0, s0.site)) === J(['BC', 'A', 'X']), J(strip(mut0, s0.site)));
}

// ─── §7 BY CONSTRUCTION ───
console.log('§7 BY CONSTRUCTION — the surface takes `altitudesAt`, and its links are keyed by the source\'s index');
const src = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8');
const alt = fs.readFileSync(path.join(repoRoot, 'src/lib/altitude.ts'), 'utf8');
check('§7 `midpointSiteOf` takes `lightsAtYoungestFirst(shape, edge)` for the lights the host\'s faces do not show and orders nothing itself (no `.sort(` in the surface — Δ80); the lib orders by the apex\'s generation, youngest first, the record\'s order between equals; the strip\'s links carry the source\'s index, never the words above/below',
  /const others = lightsAtYoungestFirst\(shape, edge\)/.test(src) && !/\.sort\(/.test(src) && /\.sort\(\(x, y\) => y\.g - x\.g \|\| x\.i - y\.i\)/.test(alt) && !/'above' : 'below'/.test(src) && /data-midpoint-source=\{String\(/.test(src), 'see the source');

console.log(`\n${failures === 0 ? "DIAGNOSE-THE-STRIPS-LIGHTS: ALL PASS — every light the record holds is in the strip, the host's first, then youngest first; the triangle's ABAC two, the tetrahedron's three, Accumulation–Class three; a square's corners kept" : `DIAGNOSE-THE-STRIPS-LIGHTS: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

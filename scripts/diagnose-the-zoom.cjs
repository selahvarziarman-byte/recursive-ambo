#!/usr/bin/env node

// DIAGNOSE THE ZOOM — STAMP ZOOM (the mothership's letter of 2026-10-19 10:23, on Arman's word Δ169: "one needs never sees it in its whole if it's big.
// we need to address that. is it possible to have zoom out zoom in on the diagrams as well?"): every diagram a person opens is seen whole, and zoomed in
// and out, in ONE form — the form slice 2's H gave the point's cast (8e1b484): `whole · zoom in · zoom out` over the drawing's box; it opens whole and
// never changes size by itself.
//
// THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the frame (`ZoomFrame`) is RENDERED under node — alone with a probe drawing, then around the midpoint
// drawing on Virgin Land's Culture and around a corner's drawing (Culture's `Value`) — and its scale moved through the store's one slot (`zoomScales`);
// the census of the diagrams is read from the SOURCE, file by file, so a drawing outside the frame cannot be forgotten. The frame's own rules (the
// writes, the guards) are pinned where H's were, in diagnose-the-childs-cast §8. What a person SEES is the concept-layer eye's (§28, §39).
// Run: node scripts/diagnose-the-zoom.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ZoomFrame, wholeScaleOf, zoomKeyOf, MAX_SCALE } = req('src/components/ZoomFrame.tsx');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const MS = req('src/components/MidpointSurface.tsx');
const { CastInsidePanel } = req('src/components/CastInsideDiagram.tsx');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const render = (el) => renderToString(el).replace(/<!-- -->/g, '');
const openTag = (html, re) => (html.match(re) || [''])[0];

console.log('THE ZOOM — every diagram a person opens is seen whole, and zoomed, in one form: `whole · zoom in · zoom out` over its box (STAMP ZOOM)\n');

// ═══ §1 THE FRAME UNDER NODE — a probe drawing of 600 × 400 ═══
const probe = () => render(React.createElement(ZoomFrame, { name: 'probe', id: 'x', width: 600, height: 400 }, (s) => React.createElement('svg', { 'data-probe-scale': s.toFixed(3), width: Math.round(600 * s), height: Math.round(400 * s), viewBox: '0 0 600 400' })));
const h1 = probe();
check('§1 ★★ IT OPENS WHOLE: with no measured box (node) the drawing stands at its natural size (`data-probe-scale="1.000"`, 600 × 400, its viewBox its own); the bar reads `whole · zoom in · zoom out`, `whole` marked, `zoom out` disabled (nothing is smaller than whole); every mark carries the diagram\'s name, and the frame names itself (`data-zoom-frame="probe"`, its id)',
  /<div data-zoom-frame="probe" data-zoom-frame-id="x"/.test(h1) && /data-probe-bar="true"/.test(h1) && /data-probe-zoom-bar="true"/.test(h1) && /data-probe-zoom="whole" data-probe-zoom-on="true"/.test(h1) && /data-probe-zoom="in"/.test(h1) && /data-probe-zoom="out" disabled=""/.test(h1) && /data-probe-box="true"/.test(h1) &&
    h1.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() === 'whole · zoom in · zoom out' && /<svg data-probe-scale="1\.000" width="600" height="400" viewBox="0 0 600 400">/.test(h1),
  h1.slice(0, 400));
S().setZoomScale(zoomKeyOf('probe', 'x'), 1.5);
const h1b = probe();
check('§1 ★★ ZOOMED THROUGH THE STORE\'S ONE SLOT (`zoomScales`, keyed by the diagram\'s name and its site): at 1.5 the drawing is 900 × 600 with its viewBox unchanged, `whole` no longer marked, `zoom out` offered; a frame of another name or another site is untouched',
  /<svg data-probe-scale="1\.500" width="900" height="600" viewBox="0 0 600 400">/.test(h1b) && !/data-probe-zoom-on/.test(h1b) && !/disabled=""/.test(h1b) &&
    /data-probe-scale="1\.000"/.test(render(React.createElement(ZoomFrame, { name: 'probe', id: 'y', width: 600, height: 400 }, (s) => React.createElement('svg', { 'data-probe-scale': s.toFixed(3) })))) &&
    /data-other-scale="1\.000"/.test(render(React.createElement(ZoomFrame, { name: 'other', id: 'x', width: 600, height: 400 }, (s) => React.createElement('svg', { 'data-other-scale': s.toFixed(3) })))),
  h1b.slice(0, 300));
check('§1 ★ THE BOX\'S CAPS: `maxHeight` caps the box itself (H\'s way: `46vh`); `fixedWidth` makes the box state its own width (the drawing\'s, capped at its panel\'s) so a panel that fits its content cannot narrow the fit that narrows the panel; neither given, the box takes the drawing\'s height and its parent\'s width',
  /style="height:404px;max-height:46vh"/.test(render(React.createElement(ZoomFrame, { name: 'p', id: 'z', width: 600, height: 400, maxHeight: '46vh' }, () => null))) &&
    /style="height:404px;width:604px;max-width:100%"/.test(render(React.createElement(ZoomFrame, { name: 'p', id: 'z', width: 600, height: 400, fixedWidth: true }, () => null))) &&
    /style="height:404px"/.test(render(React.createElement(ZoomFrame, { name: 'p', id: 'z', width: 600, height: 400 }, () => null))),
  { capped: openTag(render(React.createElement(ZoomFrame, { name: 'p', id: 'z', width: 600, height: 400, maxHeight: '46vh' }, () => null)), /<div data-p-box="true"[^>]*>/) });
check('§1 ★ THE FIT is the box over the drawing, both ways, never above 1 (H): 697 × 411 over 518 × 424 fits at 409 / 424; a small drawing stays at 1; the ceiling is 2',
  Math.abs(wholeScaleOf(697, 411, 518, 424) - 409 / 424) < 1e-9 && wholeScaleOf(697, 411, 300, 100) === 1 && MAX_SCALE === 2, { fitBig: wholeScaleOf(697, 411, 518, 424) });

// ═══ §2 THE CENSUS BY SOURCE — every diagram a person opens is in the frame; the figures that cannot grow are named with their fixed sizes ═══
const framed = {
  'src/components/ChildCast.tsx': { name: 'midpoint-child', svg: '<svg data-midpoint-own-drawing="true" data-midpoint-child-scale={scale.toFixed(3)} width={Math.round(width * scale)} height={Math.round(height * scale)} viewBox={`0 0 ${width} ${height}`}', mount: '<ZoomFrame name="midpoint-child" id={siteId} width={width} height={height} maxHeight="46vh">' },
  'src/components/MidpointSurface.tsx': { name: 'midpoint-drawing', svg: '<svg data-midpoint-drawing="true" data-midpoint-drawing-scale={fitScale.toFixed(3)}', mount: '<ZoomFrame name="midpoint-drawing" id={site.siteId} width={width} height={height} frameMaxHeight={drawMax}>' },
  'src/components/CastInsideDiagram.tsx': { name: 'inside', svg: 'data-inside-scale={scale.toFixed(3)}\n      width={Math.round(width * scale)}\n      height={Math.round(height * scale)}', mount: '<ZoomFrame name="inside" id={id ?? \'cast\'} width={width} height={height} maxHeight={maxHeight} fixedWidth>' },
};
const walk = (dir, out = []) => { for (const f of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, f.name); if (f.isDirectory()) walk(p, out); else if (/\.tsx?$/.test(f.name)) out.push(p); } return out; };
const mounts = walk(path.join(repoRoot, 'src')).filter((p) => /<ZoomFrame\b/.test(fs.readFileSync(p, 'utf8'))).map((p) => path.relative(repoRoot, p).replace(/\\/g, '/')).sort();
check('§2 ★★ THE THREE DIAGRAMS A PERSON OPENS ARE EACH IN THE FRAME, ONCE, DRAWN AT THEIR SCALE: the point tab\'s drawing of the child (`midpoint-child`, H\'s marks kept), the pairing column\'s drawing of the columns (`midpoint-drawing`, its region\'s share as the frame\'s cap), a corner\'s drawing over the solid (`inside`, the panel\'s room as the box\'s cap) — and `<ZoomFrame` is mounted in these three files and nowhere else',
  Object.entries(framed).every(([p, f]) => { const s = src(p); return s.split(f.mount).length === 2 && s.includes(f.svg) && s.split('<ZoomFrame').length === 2; }) && J(mounts) === J(Object.keys(framed).sort()),
  { mounts });
check('§2 ★★ THE FIGURES OUTSIDE THE FRAME CANNOT GROW (by construction): the modes tab\'s route drawing is 400 × 64 and the loop card\'s drawing 640 × 150, fixed in their files; they are named here so a later reader finds them, not a frame',
  src('src/components/RouteDrawing.tsx').includes('width={400} height={64} viewBox="0 0 400 64"') && src('src/components/ChildLoopCard.tsx').includes('const W = 640; const H = 150;') && !/<ZoomFrame/.test(src('src/components/RouteDrawing.tsx')) && !/<ZoomFrame/.test(src('src/components/ChildLoopCard.tsx')),
  'source pins');
const store = src('src/store/geometryStore.ts');
check('§2 ★ THE STORE: one slot (`zoomScales`), one writer (`setZoomScale`, the key alone), forgotten wherever the child view is (a new seed, the reset, an import: four places with the initial state)',
  store.includes('zoomScales: Record<string, number>;') && store.includes('setZoomScale: (key, scale) => { set({ zoomScales: { ...get().zoomScales, [key]: scale } }); },') && (store.match(/^\s*zoomScales: \{\},/gm) || []).length === 4 && (store.match(/set\(\{ zoomScales/g) || []).length === 1,
  { resets: (store.match(/^\s*zoomScales: \{\},/gm) || []).length, writers: (store.match(/set\(\{ zoomScales/g) || []).length });

// ═══ §3 THE MIDPOINT DRAWING ON CULTURE, UNDER NODE ═══
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude');
const save = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8'));
S().importWorkspace(save);
const byLabel = (l) => Object.values(cur().vertices).find((v) => v.data.label === l);
const culture = byLabel('Culture'); const value = byLabel('Value');
const renderMid = () => { const vw = MS.midpointViewOf(cur(), culture.id, { tauDrafts: S().edgeTauDrafts }); return render(React.createElement(MS.MidpointSurface, { shape: cur(), site: vw.site, parents: vw.parents, resolved: vw.resolved, refusal: null, remade: null })); };
check('§3 ★ THE IMPORT FORGOT EVERY ZOOM (a view, never a record)', !!culture && !!value && J(S().zoomScales) === '{}', S().zoomScales);
const m0 = renderMid();
const mSvg0 = openTag(m0, /<svg data-midpoint-drawing="true"[^>]*>/);
const mNat = (() => { const m = mSvg0.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return m ? { w: +m[1], h: +m[2] } : null; })();
check('§3 ★★ THE PAIRING COLUMN\'S DRAWING on Culture sits in the frame named for it and its site (`data-zoom-frame="midpoint-drawing"`, the site\'s id), opens at 1.000 with no box to read (node), its width and height its viewBox\'s, `whole` marked, `zoom out` disabled; its scale is always printed',
  m0.includes(`data-zoom-frame="midpoint-drawing" data-zoom-frame-id="${culture.id}"`) && /data-midpoint-drawing-scale="1\.000"/.test(mSvg0) && !!mNat && new RegExp(`width="${Math.round(mNat.w)}" height="${Math.round(mNat.h)}"`).test(mSvg0) && /data-midpoint-drawing-zoom="whole" data-midpoint-drawing-zoom-on="true"/.test(m0) && /data-midpoint-drawing-zoom="out" disabled=""/.test(m0) && /data-midpoint-drawing-box="true"/.test(m0),
  { svg: mSvg0.slice(0, 160), nat: mNat });
S().setZoomScale(zoomKeyOf('midpoint-drawing', culture.id), 1.25);
const m1 = renderMid();
const mSvg1 = openTag(m1, /<svg data-midpoint-drawing="true"[^>]*>/);
check('§3 ★★ ZOOMED IN THE DRAWING SCALES AS ONE: at 1.25 the svg is 1.25 × its viewBox both ways, the viewBox unchanged — every column, line and word moves together; `whole` unmarked, `zoom out` offered',
  !!mNat && /data-midpoint-drawing-scale="1\.250"/.test(mSvg1) && new RegExp(`width="${Math.round(mNat.w * 1.25)}" height="${Math.round(mNat.h * 1.25)}" viewBox="0 0 ${mNat.w} ${mNat.h}"`).test(mSvg1) && !/data-midpoint-drawing-zoom-on/.test(m1) && !/data-midpoint-drawing-zoom="out" disabled=""/.test(m1),
  mSvg1.slice(0, 200));
check('§3 ★ THE POINT TAB\'S DRAWING IS UNTOUCHED BY THE OTHER FRAME\'S ZOOM (its own key): the child\'s cast on the same page stands at 1.000',
  /data-midpoint-child-scale="1\.000"/.test(m1), openTag(m1, /<svg data-midpoint-own-drawing="true"[^>]*>/).slice(0, 120));

// ═══ §4 A CORNER'S DRAWING OVER THE SOLID, UNDER NODE ═══
const c0 = render(React.createElement(CastInsidePanel, { shape: cur(), vertexId: value.id }));
const cSvg0 = openTag(c0, /<svg data-inside="[^"]*"[^>]*>/);
const cNat = (() => { const m = cSvg0.match(/viewBox="(-?[\d.]+) 0 ([\d.]+) ([\d.]+)"/); return m ? { w: +m[2], h: +m[3] } : null; })();
check('§4 ★★ VALUE\'S DRAWING over the solid sits in the frame named for it and its corner (`inside`, the vertex id), opens at 1.000, `whole` marked; its box is capped at what the panel leaves (`calc(100vh - 14rem)`) and states its own width (the drawing\'s, capped at the panel\'s); the panel is the overlay',
  c0.includes(`data-zoom-frame="inside" data-zoom-frame-id="${value.id}"`) && /data-inside-scale="1\.000"/.test(cSvg0) && !!cNat && new RegExp(`width="${Math.round(cNat.w)}" height="${Math.round(cNat.h)}"`).test(cSvg0) && /data-inside-zoom="whole" data-inside-zoom-on="true"/.test(c0) &&
    new RegExp(`<div data-inside-box="true" style="height:${Math.round(cNat.h) + 4}px;max-height:calc\\(100vh - 14rem\\);width:${Math.round(cNat.w) + 4}px;max-width:100%"`).test(c0) && /data-inside-placement="overlay"/.test(c0),
  { svg: cSvg0.slice(0, 160), box: openTag(c0, /<div data-inside-box="true"[^>]*>/) });
S().setZoomScale(zoomKeyOf('inside', value.id), 2);
const c1 = render(React.createElement(CastInsidePanel, { shape: cur(), vertexId: value.id }));
const cSvg1 = openTag(c1, /<svg data-inside="[^"]*"[^>]*>/);
check('§4 ★★ ZOOMED TO THE CEILING the drawing is 2 × its viewBox, the lane and every label with it (the viewBox unchanged); another corner\'s drawing stands at 1.000',
  !!cNat && /data-inside-scale="2\.000"/.test(cSvg1) && new RegExp(`width="${Math.round(cNat.w * 2)}" height="${Math.round(cNat.h * 2)}"`).test(cSvg1) && cSvg1.includes(`viewBox="${cSvg0.match(/viewBox="([^"]*)"/)[1]}"`) &&
    /data-inside-scale="1\.000"/.test(render(React.createElement(CastInsidePanel, { shape: cur(), vertexId: byLabel('Fact').id }))),
  cSvg1.slice(0, 200));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-ZOOM: ALL PASS — one frame on every diagram a person opens: whole as it opens, zoomed only by his acts, drawn at its scale as one; the census by source names the three framed and the two that cannot grow' : `DIAGNOSE-THE-ZOOM: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

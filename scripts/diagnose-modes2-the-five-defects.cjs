#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-2 (2026-09-29; the mothership's 10:00 — five defects found by a customer-side agent at 925a177, each
// verified in the source at 7c64c61; MARKER MODES-2 · M1 — the designer's words, 10:23 §3, chartered 10:27): each defect CURED AS A
// PROPERTY, read on the agent's own saves (`.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves/`, customer-side evidence, tracked BY
// NAME) and on the seeded tetrahedron, the surface rendered under node (react-dom/server):
//   (a) ONE CARD, ONE COUNT (§149): at a generation-2 medial site the born-room sentence counts what the columns hold — each
//       corner's CHILD (its relatings, `childSpaceOf`, the head's own reader) — `the born room: X's N relatings and Y's M, side by
//       side · none related yet | · k related` (her §1 words); at a corner site the SEED is the carried side and comes first;
//   (b) THE GHOST LIGHTS: two lights with one pair of ends and different links are two lights — each keyed by what it goes
//       through (`via`), no two alike, and React warns of no duplicate key (the ghost's mechanism);
//   (c) the corner card's false clause `a corner edge holds no born room: nothing here is yours to pair` is STRUCK, no replacement;
//   (d) THE SEVEN STATES at §8's precedence, one token — UNDETECTED · VACUOUS · UNRULED · POCKET · EXHAUSTED · CLOSED · COHERENT
//       (· OPEN, the counts) — every site's line in the form its token names; the POCKET line in her shape (one line per relating);
//   (e) the argument card prints a name whole — pinned where the lift fixture lives, scripts/diagnose-argument-card.cjs §10.
//
// Run: node scripts/diagnose-modes2-the-five-defects.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n        ${detail}` : ''}`);
  if (!ok) failures += 1;
};
const note = (text) => console.log(`      · ${text}`);

const { spaceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { childSpaceOf } = req('src/lib/instanceSpace.ts');
const { mediumOf } = req('src/lib/descent.ts');
const { instancesOn } = req('src/lib/relatings.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { parseWorkspaceImport } = req('src/lib/workspacePersistence.ts');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');

const unesc = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim();
const elementsIn = (src, attr) => {
  const out = [];
  const re = new RegExp(`<(span|div)[^>]*${attr}="([^"]*)"[^>]*>`, 'g');
  let m;
  while ((m = re.exec(src))) {
    const tag = m[1]; let depth = 1; let end = re.lastIndex;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g'); tagRe.lastIndex = re.lastIndex;
    let t;
    while (depth > 0 && (t = tagRe.exec(src))) { depth += t[1] === '/' ? -1 : 1; end = tagRe.lastIndex; }
    out.push([m[2], src.slice(m.index, end)]);
  }
  return out;
};
const linesIn = (src, attr) => elementsIn(src, attr).map(([v, h]) => [v, unesc(h)]);

/** the surface rendered under node at a site; React's console.error captured (a duplicate key is a warning there) */
const renderAt = (shape, siteId) => {
  const packet = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === siteId);
  const site = midpointSiteOf(shape, siteId, packet ? packet.trace : null);
  const resolved = spaceOf(shape, siteId);
  const parents = [spaceOf(shape, site.a), spaceOf(shape, site.b)];
  const errors = [];
  const orig = console.error;
  console.error = (...args) => { errors.push(args.map((a) => String(a)).join(' ')); };
  let html;
  try { html = renderToString(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal: null, remade: null })).replace(/<!-- -->/g, ''); } finally { console.error = orig; }
  const start = html.indexOf('<div data-medium="true"');
  const after = start >= 0 ? html.indexOf('<div data-midpoint-trace="true"', start) : -1;
  const block = start >= 0 ? html.slice(start, after > 0 ? after : undefined) : '';
  const attr = (name) => { const m = block.match(new RegExp(`<div data-medium="true"[^>]*${name}="([^"]*)"`)); return m ? m[1] : null; };
  return { html, block, site, errors, sentence: (linesIn(html, 'data-midpoint-sentence')[0] || [])[1] || '', head: (linesIn(block, 'data-medium-head')[0] || [])[1] || '', stateLine: (linesIn(block, 'data-medium-state-line')[0] || [])[1] || '', state: attr('data-medium-state'), pocketLines: linesIn(block, 'data-medium-pocket-line').map(([, s]) => s), lights: linesIn(block, 'data-medium-light-derived') };
};
const S = () => useGeometryStore.getState();
const loadWorkspace = (file) => {
  const ws = parseWorkspaceImport(JSON.parse(fs.readFileSync(file, 'utf8')));
  useGeometryStore.setState({ shapes: ws.shapes, shapeOrder: ws.shapeOrder, currentShapeId: ws.currentShapeId, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: ws.lexicon ?? [], rules: ws.rules ?? [] });
  return ws.shapes[ws.currentShapeId];
};
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label);
const siteBetween = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u.id) && w.createdBy.sourceVertexIds.includes(v.id));
const isBorn = (shape, id) => shape.vertices[id] && shape.vertices[id].createdBy.operation !== 'seed';
const medialSites = (shape) => Object.values(shape.vertices).filter((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.every((p) => isBorn(shape, p)));
const cornerSites = (shape) => Object.values(shape.vertices).filter((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.filter((p) => isBorn(shape, p)).length === 1);

const SAVES = path.join(repoRoot, '.handoff/REPORTS_CUSTOMER-SIDE_2026-09-28/saves');
console.log('THE FIVE DEFECTS — MODES-2 (the customer-side runs)\n');
if (!fs.existsSync(SAVES)) {
  note(`the customer-side saves are not on this checkout (${SAVES}) — the properties on them are skipped; the source pins below still run`);
}

// ═══ (a) + (b) + (d) on run 2's final state ═══
const G2V = path.join(SAVES, 'ta2/saves/g2_verdicts.json');
if (fs.existsSync(G2V)) {
  console.log('----- (a) (b) (d) on ta2/saves/g2_verdicts.json — the final state of run 2 -----');
  const shape = loadWorkspace(G2V);
  const sites = medialSites(shape);
  note(`generation-2 medial sites: ${sites.length} · corner sites: ${cornerSites(shape).length}`);
  // (b) the ghost lights: Event–Institution
  const ev = byLabel(shape, 'Event'); const inst = byLabel(shape, 'Institution');
  const evIn = ev && inst ? siteBetween(shape, ev, inst) : null;
  if (evIn) {
    const e = edgeBetween(shape.edges, ev.id, inst.id);
    const m = mediumOf(shape, e, {}, S().rules);
    const keys = m.lights.map((l) => `${l.kind}|${l.x}|${l.y}|${l.through}|${l.via}`);
    const endsOnly = m.lights.map((l) => `${l.kind}|${l.x}|${l.y}|${l.through}`);
    const r = renderAt(shape, evIn.id);
    note(`Event–Institution: ${m.lights.length} lights · ${new Set(keys).size} distinct keys with the link · ${new Set(endsOnly).size} distinct without it (the ghost's ${m.lights.length - new Set(endsOnly).size} duplicates) · lines printed ${r.lights.length} · React errors ${r.errors.length}`);
    check('(b) ★★ THE GHOST LIGHTS: at Event–Institution every light is keyed by WHAT IT GOES THROUGH — no two keys alike (before: the key had no link and several ends coincided, React warned of duplicate keys and nine lights outlived their card); the shared-coordinate kind prints its inherited reading, the opposite-midpoint kind its light with `by …`; React warns of nothing', new Set(keys).size === keys.length && keys.length > 0 && r.errors.filter((s) => /same key|duplicate/i.test(s)).length === 0 && r.errors.length === 0, J({ lights: keys.length, distinct: new Set(keys).size, withoutLink: new Set(endsOnly).size, errors: r.errors.slice(0, 2) }));
    check('(b) the opposite-midpoint light names the relating it goes through, as he said it: `only in Adequation\'s light: (Use performed-in Communicative act) with (Social fact created-by Communicative act) — by Use constitutes Social fact — no relating between Institution and Event says so` (the two corners in the edge\'s stored order)', r.lights.filter(([k]) => k === 'opposite-midpoint').every(([, s]) => /^only in .+'s light: \(.+\) with \(.+\) — by .+ — no relating between .+ and .+ says so$/.test(s) || /^in .+'s light too: \(.+\) with \(.+\) — by .+ — you related them$/.test(s)) && r.lights.some(([k]) => k === 'opposite-midpoint'), J(r.lights.filter(([k]) => k === 'opposite-midpoint').slice(0, 2)));
  } else note('Event–Institution not found on this save — (b) skipped');
  // (a) one card, one count at every medial site
  const counts = sites.map((v) => {
    const [pa, pb] = v.createdBy.sourceVertexIds;
    const r = renderAt(shape, v.id);
    const e = edgeBetween(shape.edges, pa, pb);
    const la = shape.vertices[e.vertexIds[0]].data.label; const lb = shape.vertices[e.vertexIds[1]].data.label;
    const ca = childSpaceOf(shape, e.vertexIds[0])?.roles.length ?? -1; const cb = childSpaceOf(shape, e.vertexIds[1])?.roles.length ?? -1;
    const related = instancesOn(e).length;
    const wanted = `the born room: ${la}'s ${ca} relatings and ${lb}'s ${cb}, side by side · ${related ? `${related} related` : 'none related yet'}`;
    const head = r.head.match(/— \d+ modes? · (\d+) × (\d+) roles · \d+ could be related · (\d+) related/);
    return { site: v.data.label || v.id, ok: r.sentence.includes(wanted) && !!head && Number(head[1]) === ca && Number(head[2]) === cb && Number(head[3]) === related, sentence: r.sentence.slice(r.sentence.indexOf('the born room:')), head: r.head };
  });
  check('(a) ★★ ONE CARD, ONE COUNT (§149): at every generation-2 medial site the born-room sentence counts what the columns hold — `the born room: X\'s N relatings and Y\'s M, side by side · k related` — and N × M and k are the head\'s own numbers (`childSpaceOf`, one reader), never the parents\' leftovers', counts.length > 0 && counts.every((c) => c.ok), J(counts.filter((c) => !c.ok).slice(0, 2).map((c) => [c.site, c.sentence, c.head])));
  note(`e.g. ${counts[0] ? `${counts[0].site}: ${counts[0].sentence} ‖ ${counts[0].head}` : '—'}`);
  // (d) the seven states at §8's precedence, one token, the line in the token's form
  const FORMS = {
    UNDETECTED: /^.+ and .+ together, as two — not yet looked into: nothing related between them yet$/,
    VACUOUS: /^.+, \d+ relatings? — not yet seen through .+: no passage through (it|either|any) yet$/,
    UNRULED: /^\d+ relatings? theirs alone · \d+ relatings? the face's$/,
    POCKET: /^the views leave different things alone — nothing is theirs alone under every view$/,
    EXHAUSTED: /^nothing theirs alone — (its one relating is|all \d+ relatings are) also said through .+$/,
    CLOSED: /^all the face's — nothing theirs alone, nothing only in a corner's light$/,
    COHERENT: /^nothing against it — \d+ passages? through .+, none unsaid; no bar pressed, no say differs, the views agree on what is theirs alone$/,
    OPEN: /^\d+ relatings? theirs alone · \d+ relatings? the face's$/,
  };
  const states = sites.map((v) => { const r = renderAt(shape, v.id); return { site: v.data.label || v.id, state: r.state, line: r.stateLine, ok: !!r.state && FORMS[r.state] && FORMS[r.state].test(r.stateLine), pocketLines: r.pocketLines }; });
  const census = states.reduce((acc, s) => { acc[s.state] = (acc[s.state] || 0) + 1; return acc; }, {});
  note(`the 24 sites' tokens at §8's precedence: ${J(census)}`);
  check('(d) ★★ THE SEVEN STATES, ONE TOKEN at §8\'s precedence: every generation-2 site\'s state line is in the form its token names (UNDETECTED · VACUOUS · UNRULED — the counts, her §3 per view · POCKET — her head · EXHAUSTED · CLOSED · COHERENT · OPEN — the counts), and no line is out of its token', states.every((s) => s.ok), J(states.filter((s) => !s.ok).slice(0, 3)));
  const pockets = states.filter((s) => s.state === 'POCKET');
  check('(d) M1 (d) THE POCKET in her shape: the head `the views leave different things alone — nothing is theirs alone under every view`, then one line per relating some view leaves alone (`… — theirs alone through … · the face\'s through …`), never a first', pockets.length === 0 || pockets.every((s) => s.pocketLines.length > 0 && s.pocketLines.every((l) => /^.+ — theirs alone through .+( · the face's through .+)?$/.test(l))), J(pockets.slice(0, 1).map((s) => [s.site, s.pocketLines.slice(0, 2)])));
}

// ═══ (a) + (c) on run 2's corner acts ═══
const G2C = path.join(SAVES, 'ta2/saves/g2_corner.json');
if (fs.existsSync(G2C)) {
  console.log('\n----- (a) (c) on ta2/saves/g2_corner.json — the 70 coordinate relatings on the 12 corner edges -----');
  const shape = loadWorkspace(G2C);
  const corners = cornerSites(shape);
  const rows = corners.map((v) => {
    const r = renderAt(shape, v.id);
    const [pa, pb] = v.createdBy.sourceVertexIds;
    const seed = isBorn(shape, pa) ? pb : pa; const child = isBorn(shape, pa) ? pa : pb;
    const ls = shape.vertices[seed].data.label; const lc = shape.vertices[child].data.label;
    return { site: v.data.label || v.id, seedFirst: r.sentence.startsWith(`${ls}'s `), carried: new RegExp(`^${ls.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}'s \\d+ roles and \\d+ words carried into ${lc.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')} as one — composed, not yours \\(their points hollow\\)$`).test(r.sentence), clause: /holds no born room|nothing here is yours to pair/.test(r.sentence), sentence: r.sentence, head: r.head };
  });
  note(`corner sites: ${rows.length} · e.g. ${rows[0] ? `${rows[0].site}: ${rows[0].sentence} ‖ ${rows[0].head}` : '—'}`);
  check('(c) ★★ THE FALSE CLAUSE IS STRUCK: no corner site prints `a corner edge holds no born room: nothing here is yours to pair` — the store takes the act (the agent gave 70) and the sentence no longer denies it; no replacement (the head, the columns and the gesture say what the site is)', rows.length > 0 && rows.every((r) => !r.clause), J(rows.filter((r) => r.clause).slice(0, 2).map((r) => r.sentence)));
  check('(a) ★★ AT A CORNER SITE THE SEED IS THE CARRIED SIDE AND COMES FIRST, whichever corner is stored first: `⟨seed⟩\'s N roles and M words carried into ⟨child⟩ as one — composed, not yours (their points hollow)` on all 12', rows.every((r) => r.seedFirst && r.carried), J(rows.filter((r) => !(r.seedFirst && r.carried)).slice(0, 2).map((r) => r.sentence)));
  const cornerRelated = rows.map((r) => { const m = r.head.match(/(\d+) related/); return m ? Number(m[1]) : -1; });
  note(`the corner cards' heads count the agent's relatings: ${J(cornerRelated)}`);
}

// ═══ the source pins ═══
console.log('\n----- the source: one reader, no parse -----');
const textOf = (s) => s.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const ms = textOf(readLf('src/components/MidpointSurface.tsx'));
check('(a) the sentence counts through `childSpaceOf` — the block\'s head\'s own reader — and `instancesOn` for what is related here; the seed-first flag reads the record (`createdBy.operation === \'seed\'`)', /childCounts = useMemo\(\(\) => \(\{ a: childSpaceOf\(shape, site\.a\)\?\.roles\.length \?\? 0, b: childSpaceOf\(shape, site\.b\)\?\.roles\.length \?\? 0 \}\)/.test(ms) && /relatedHere = useMemo\(\(\) => \(sourceEdge \? instancesOn\(sourceEdge\)\.length : 0\)/.test(ms) && /seedFirst = shape\.vertices\[site\.a\]\?\.createdBy\.operation === 'seed'/.test(ms) && !/bornRoom\b/.test(ms));
check('(c) the clause is gone from the source', !/holds no born room/.test(ms));
const ar = readLf('src/manuscript/argumentReadingModel.ts');
check('(e) the argument card never reads inside a name: no `indexOf(\' of \')` in the model; the result slot takes the lift\'s name whole; the source comes from the record through a shape resolver (pinned in scripts/diagnose-argument-card.cjs §10 with the fixture)', !/indexOf\(' of '\)/.test(ar) && /operation === 'patch-lift' && form\.shape\.name\) return form\.shape\.name;/.test(ar) && /resolveShape\?: ShapeResolver/.test(ar));
const so = readLf('src/lib/sorting.ts');
check('(d) the sorting\'s state is ONE token at §8\'s precedence in the source: UNDETECTED · VACUOUS · UNRULED · POCKET · EXHAUSTED · CLOSED · COHERENT · OPEN', /'UNDETECTED' \| 'VACUOUS' \| 'UNRULED' \| 'POCKET' \| 'EXHAUSTED' \| 'CLOSED' \| 'COHERENT' \| 'OPEN'/.test(so) && /\? 'UNDETECTED'\s*\n\s*: !looked \? 'VACUOUS'\s*\n\s*: unruled \? 'UNRULED'\s*\n\s*: pocket \? 'POCKET'\s*\n\s*: ownAll\.length === 0 && instances\.length > 0 \? \(light \? 'EXHAUSTED' : 'CLOSED'\)\s*\n\s*: coherent \? 'COHERENT'\s*\n\s*: 'OPEN'/.test(so));

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES2-THE-FIVE-DEFECTS: ALL PASS — one card one count at every generation-2 site, the seed first at a corner site and its false clause gone, every light keyed by what it goes through, the seven states one token at §8\'s precedence with the pocket in her shape, and a name printed whole' : `DIAGNOSE-MODES2-THE-FIVE-DEFECTS: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

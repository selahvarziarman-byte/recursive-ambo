#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-FINDINGS-BATCH · SLICE 2, parts A and H (Arman's 11:00; the mothership's 11:06; the form Arman approved at 10:55 — the
// designer's 10:56 letter and her mock `.handoff/DESIGN_THE-CHILDS-CAST/index.html`): THE CHILD'S CAST in the point tab, on Virgin Land's `Culture`
// (her 19:34 export, Value–Fact, 18 relatings and 8 bars). A — the roles' names (ADR 0031 §9.38 (c) with its guard; claims §345, §352): §1 the drawing, one row
// per role read by its sentence, D4's record never drawn · §2 the card of a chosen role (its sentence, `name it`, its qualities by corner) · §3 a name
// given (the row keeps its sentence; the card's `rename · withdraw`; the log) · §4 THE GUARD (a duplicate refused by name, nothing recorded, the field
// keeping what he typed) · §5 a name goes with its relating, and with its pair, and never comes back when the relating is made again · §6 a name
// withdrawn · §7 the file. H — §8 the zoom (the view's scale, `whole · zoom in · zoom out`, never changing by itself). §9 the name designates only.
// Every name typed here is this witness's own (the designer's 09:05: a stand-in never reaches the page).
// Run: node scripts/diagnose-the-childs-cast.cjs

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
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { childRowsOf, wholeScaleOf, qualitiesOf: pageQualitiesOf } = req('src/components/ChildCast.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const { childSpaceOf, termWordsOf, instanceKey } = req('src/lib/instanceSpace.ts');
const { relatingsHeld, dirOf, ALONG, withoutRelating } = req('src/lib/relatings.ts');
const { validateWorkspaceImport } = req('src/lib/workspacePersistence.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attrsOf = (html, attr) => [...html.matchAll(new RegExp(`${attr}="([^"]*)"`, 'g'))].map((m) => unesc(m[1]));
const countOf = (html, attr) => (html.match(new RegExp(`${attr}=`, 'g')) || []).length;
const fieldOf = (html) => { const m = html.match(/<input data-midpoint-child-name-input="true"[^>]*value="([^"]*)"/); return m ? unesc(m[1]) : null; }; // the name field's value (React writes `value` last)
const textOf = (html, attr) => { const m = html.match(new RegExp(`${attr}="[^"]*"[^>]*>([^<]*)<`)); return m ? unesc(m[1]) : null; };

// ── Virgin Land's Culture, opened through the store's own import ──
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json');
const ws = JSON.parse(fs.readFileSync(FIX, 'utf8'));
const S = () => useGeometryStore.getState();
const notTaken = S().importWorkspace(ws);
const shape0 = () => S().shapes[S().currentShapeId];
const sh = shape0();
const cornerOf = (lab) => Object.values(sh.vertices).find((v) => v.data?.label === lab && v.data?.cast)?.id;
const V = cornerOf('Value');
const F = cornerOf('Fact');
const mid = Object.values(sh.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(V) && v.createdBy.sourceVertexIds.includes(F));
const siteId = mid.id;
const SH = sh.id; // names are kept per shape, as the relatings they name are: Culture's record
const edge = sh.edges.find((e) => e.vertexIds.includes(V) && e.vertexIds.includes(F));
const [X, Y] = edge.vertexIds;
const labelOf = (v) => sh.vertices[v].data.label;
const castOf = (v) => sh.vertices[v].data.cast;
const roleLabel = (v, id) => castOf(v).roles.find((r) => r.id === id)?.label ?? id;
const render = () => {
  const shape = shape0();
  const packet = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === siteId);
  const site = midpointSiteOf(shape, siteId, packet ? packet.trace : null);
  return renderToString(React.createElement(MidpointSurface, { shape, site, parents: [spaceOf(shape, site.a), spaceOf(shape, site.b)], resolved: spaceOf(shape, siteId), refusal: null, remade: null })).replace(/<!-- -->/g, '');
};
const ownOf = (html) => (html.split('data-midpoint-own="glued"')[1] || '').split('data-midpoint-panel="modes"')[0];
const rowOf = (html, key) => { const m = html.match(new RegExp(`<g data-midpoint-child-row="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?</g>`)); return m ? m[0] : ''; };
const cardOf = (html) => (html.split('data-midpoint-child-card=')[1] || '').split('data-midpoint-panel="modes"')[0];
const choose = (key, scale = null) => S().setChildView({ siteId, key, scale });

// the expected, read off the EDGE and the CASTS directly — never through the child's reader the page uses (agreement is not correctness)
const positives = relatingsHeld(edge).filter((r) => r[3] === '+');
const keyOf = (r) => instanceKey(r[0], r[1], r[2], dirOf(r));
const sentenceOf = (r) => (dirOf(r) === ALONG ? `(${roleLabel(X, r[1])} ${r[0]} ${roleLabel(Y, r[2])})` : `(${roleLabel(Y, r[2])} ${r[0]} ${roleLabel(X, r[1])})`);
const qualitiesOf = (r) => [[X, r[1]], [Y, r[2]]].flatMap(([v, id]) => Object.entries(castOf(v).roles.find((x) => x.id === id)?.types ?? {}).filter(([, val]) => val !== 'UNKNOWN').map(([k, val]) => `${labelOf(v)}'s ${k}: ${val}`)).join(' · ');

console.log(`Culture: ${labelOf(X)}–${labelOf(Y)} · ${positives.length} relatings standing · the import took everything (${J(notTaken)})`);

// ═══ §1 THE DRAWING ═══
const h0 = render();
const own0 = ownOf(h0);
const rows0 = attrsOf(own0, 'data-midpoint-child-row');
const labels0 = attrsOf(own0, 'data-midpoint-child-point');
check('§1 ★★ ONE ROW PER ROLE, READ BY ITS SENTENCE (the approved form): Culture\'s drawing holds one row per relating that stands, in the edge\'s order, each row\'s key the relating it is and its words the sentence as he said it — `(the price is the case as the instituted)` — the same words the next generation reads (`termWordsOf`); nothing named, nothing chosen',
  notTaken.length === 0 && rows0.length === positives.length && J(rows0) === J(positives.map(keyOf)) && J(labels0) === J(positives.map(sentenceOf)) && labels0.every((l, i) => l === termWordsOf(shape0(), siteId, rows0[i])) && countOf(own0, 'data-midpoint-child-name') === 0 && countOf(own0, 'data-midpoint-child-chosen') === 0,
  { rows: rows0.length, expected: positives.length, first: labels0.slice(0, 2) });
check('§1 ★★ D4\'S RECORD IS READ, NEVER DRAWN (ADR 0031 §9.40–§9.41; the mock draws none of it): no arc, no parent\'s word, no column of the old drawing in the concept\'s drawing — the child\'s relations are its filled loops, drawn by the slices that follow; the rows carry no qualities (they go to the card)',
  countOf(own0, 'data-inside-arc') === 0 && countOf(own0, 'data-inside-column') === 0 && countOf(own0, 'data-inside-point') === 0 && !/exists in time|can still be otherwise/.test(unesc((own0.split('data-midpoint-child-card=')[0]))),
  { arcs: countOf(own0, 'data-inside-arc'), columns: countOf(own0, 'data-inside-column') });
check('§1 ★ EVERY ROW IS REACHABLE WITHOUT A POINTER (the review, 12:2x): each row is a button in the page\'s order (`role="button"`, `tabindex="0"`), its words its accessible name; Enter or space chooses it',
  (own0.match(/<g data-midpoint-child-row="[^"]*"[^>]*>/g) || []).length === positives.length && (own0.match(/<g data-midpoint-child-row="[^"]*"[^>]*>/g) || []).every((g) => /role="button"/.test(g) && /tabindex="0"/.test(g) && /aria-label="\(/.test(g)) &&
    /if \(ev\.key === 'Enter' \|\| ev\.key === ' '\) \{ ev\.preventDefault\(\); choose\(key\); \}/.test(fs.readFileSync(path.join(repoRoot, 'src/components/ChildCast.tsx'), 'utf8')));
check('§1 ★ WITH NOTHING CHOSEN the card\'s place says what choosing does — `choose a role: its loops are drawn, and its card opens below` (the mock\'s words, now that slice 2 · E draws them) — and holds no field',
  textOf(own0, 'data-midpoint-child-card-hint') === 'choose a role: its loops are drawn, and its card opens below' && countOf(own0, 'data-midpoint-child-name-input') === 0 && attrsOf(own0, 'data-midpoint-child-card')[0] === 'none');

// ═══ §2 THE CARD ═══
const r1 = positives.find((r) => keyOf(r) === 'price is the case as instituted') || positives[1];
const r2 = positives.find((r) => keyOf(r) === 'good is the case as done') || positives[2];
const k1 = keyOf(r1); const k2 = keyOf(r2);
choose(k1);
const h1 = render();
const c1 = cardOf(h1);
check('§2 ★★ THE CARD OF THE CHOSEN ROLE (the designer\'s 09:03 §2, her 10:56): the row outlined; the card opens with the role\'s sentence and `name it` beside an EMPTY field (born unnamed: a true absence, nothing proposed); no `rename`, no `withdraw`',
  attrsOf(ownOf(h1), 'data-midpoint-child-chosen').length === 1 && rowOf(h1, k1).includes('data-midpoint-child-chosen="true"') && attrsOf(h1, 'data-midpoint-child-card')[0] === k1 && textOf(c1, 'data-midpoint-child-card-sentence') === sentenceOf(r1) && fieldOf(c1) === '' && /data-midpoint-child-name-it="true"[^>]*>name it</.test(c1) && countOf(c1, 'data-midpoint-child-rename') === 0 && countOf(c1, 'data-midpoint-child-withdraw-name') === 0,
  { card: attrsOf(h1, 'data-midpoint-child-card')[0], sentence: textOf(c1, 'data-midpoint-child-card-sentence') });
check('§2 ★ THE FIELD SAYS WHAT IT IS FOR to a reader that cannot see it: `a name for (the price is the case as the instituted)`',
  /aria-label="a name for \(the price is the case as the instituted\)"/.test(unesc(c1)));
check('§2 ★★ ITS QUALITIES, EACH NAMED BY ITS CORNER (the designer\'s 09:03 §2.2: the corner\'s name, never `A:` or `B:`): read off the two parents\' casts directly — `Value\'s exists in time: yes · Fact\'s can still be otherwise: yes · Fact\'s the case because counted: yes`',
  textOf(c1, 'data-midpoint-child-qualities') === qualitiesOf(r1) && !/\b[AB]:/.test(textOf(c1, 'data-midpoint-child-qualities') || '') && !/mode/.test(textOf(c1, 'data-midpoint-child-qualities') || ''),
  { page: textOf(c1, 'data-midpoint-child-qualities'), expected: qualitiesOf(r1) });

// at generation 2, on a shape made for the purpose: S born of the born AB (itself of A and B) and the seed C
const g2 = { vertices: { s: { id: 's', createdBy: { operation: 'ambo', sourceVertexIds: ['ab', 'c'] }, data: { label: 'S' } }, ab: { id: 'ab', createdBy: { operation: 'ambo', sourceVertexIds: ['a', 'b'] }, data: { label: 'AB' } }, a: { id: 'a', createdBy: { operation: 'seed', sourceVertexIds: [] }, data: { label: 'A' } }, b: { id: 'b', createdBy: { operation: 'seed', sourceVertexIds: [] }, data: { label: 'B' } }, c: { id: 'c', createdBy: { operation: 'seed', sourceVertexIds: [] }, data: { label: 'C' } } }, edges: [{ id: 'e0', vertexIds: ['a', 'b'] }, { id: 'e1', vertexIds: ['ab', 'c'] }] };
const q2 = pageQualitiesOf(g2, 's', { mode: 'carries', 'A:mode': 'is the case as', 'A:A:exists in time': 'yes', 'A:A:mode': 'odd', 'B:counted': 'no' });
check('§2 ★★ AT GENERATION 2 THE QUALITIES READ THROUGH THE CHILD\'S ONE READER OF ITS WORD KEYS (`wordWordsOf`; the review, 12:2x): `A:A:exists in time` reads `A\'s exists in time through AB` (never `AB\'s A:exists in time`), C\'s quality `C\'s counted`; the relatings\' modes leave at every depth (the role\'s own `mode`; `A:mode`, the born AB\'s relating\'s mode) while a SEED\'s quality that happens to be called `mode` stays a quality (`A\'s mode through AB`)',
  J(q2) === J([["A's exists in time through AB", 'yes'], ["A's mode through AB", 'odd'], ["C's counted", 'no']]), q2);

// ═══ §3 A NAME GIVEN ═══
const N1 = 'cw-name one'; const N2 = 'cw-name two'; const N3 = 'cw-name three';
const logAt = S().log.length;
const given = S().nameRole(siteId, k1, N1);
const h3 = render();
const row3 = rowOf(h3, k1); const c3 = cardOf(h3);
const e3 = S().log[S().log.length - 1];
check('§3 ★★ A NAME HE GIVES (§9.38 (c)): taken (no refusal), recorded `[site, role, name]`, and THE ROW KEEPS ITS SENTENCE (the designer\'s 09:18 §2) — the name on its line, the sentence under it, in the same row; the card reads `<name> · rename · withdraw` with the sentence under it, the field closed',
  given === null && J(S().roleNames) === J([[SH, siteId, k1, N1]]) && textOf(row3, 'data-midpoint-child-name') === N1 && textOf(row3, 'data-midpoint-child-sentence') === sentenceOf(r1) && row3.indexOf('data-midpoint-child-name=') < row3.indexOf('data-midpoint-child-sentence=') &&
    textOf(c3, 'data-midpoint-child-card-name') === N1 && textOf(c3, 'data-midpoint-child-card-sentence') === sentenceOf(r1) && /data-midpoint-child-rename="true"[^>]*>rename</.test(c3) && /data-midpoint-child-withdraw-name="true"[^>]*>withdraw</.test(c3) && countOf(c3, 'data-midpoint-child-name-input') === 0,
  { names: S().roleNames, row: textOf(row3, 'data-midpoint-child-name'), card: textOf(c3, 'data-midpoint-child-card-name') });
check('§3 ★★ BY A TRACED ACT (D17): the naming is one log line `rolename` — the site, the role\'s key, the name, and the name before (none) — appended at its position',
  S().log.length === logAt + 1 && e3.act === 'rolename' && e3.shape === SH && e3.site === siteId && e3.role === k1 && e3.name === N1 && e3.was === '' && e3.n === logAt + 1, e3);
const renamedOk = S().nameRole(siteId, k1, N2);
const e3b = S().log[S().log.length - 1];
const sameAgain = S().nameRole(siteId, k1, `  ${N2} `);
check('§3 ★ A RENAME is one more line (`was` the name it replaces); giving a role the name it already holds, spaced or not, records nothing',
  renamedOk === null && e3b.act === 'rolename' && e3b.name === N2 && e3b.was === N1 && sameAgain === null && S().log.length === logAt + 2 && J(S().roleNames) === J([[SH, siteId, k1, N2]]),
  { last: e3b, names: S().roleNames });

// ═══ §4 THE GUARD ═══
const logBefore = S().log.length;
choose(k2);
const refused = S().nameRole(siteId, k2, ` ${N2}  `);
const h4 = render();
const c4 = cardOf(h4);
check('§4 ★★ THE GUARD (§9.38 (c): naming designates, it never identifies): a second role given a name another role of this child holds is REFUSED BY NAME — `"cw-name two" already names (the price is the case as the instituted)`, the holder said by its sentence; the test is the declared-twice test (exact, trimmed); nothing recorded, nothing logged',
  refused === `"${N2}" already names ${sentenceOf(r1)}` && J(S().roleNames) === J([[SH, siteId, k1, N2]]) && S().log.length === logBefore,
  { refused, names: S().roleNames });
check('§4 ★★ THE REFUSAL WHERE THE ACT WAS MADE (the designer\'s 09:18 §1): under the field, `not taken — "cw-name two" already names (the price is the case as the instituted)`, no button; THE FIELD KEEPS WHAT HE TYPED so he can change it; the role holding the name stands in the drawing with its name',
  textOf(c4, 'data-midpoint-child-name-refusal') === `not taken — "${N2}" already names ${sentenceOf(r1)}` && attrsOf(c4, 'data-midpoint-child-name-refusal')[0] === k1 && fieldOf(c4) === N2 && !/<button[^>]*>[^<]*<\/button>\s*<\/span>\s*$/.test((c4.split('data-midpoint-child-name-refusal=')[1] || '').split('</span>')[0]) && textOf(rowOf(h4, k1), 'data-midpoint-child-name') === N2,
  { refusal: textOf(c4, 'data-midpoint-child-name-refusal') });
S().clearRoleNameRefusal();
const h4b = render();
check('§4 ★ THE REFUSAL GOES when he changes what he typed (the field\'s change clears it — `clearRoleNameRefusal`), and on another role\'s card it never shows',
  countOf(cardOf(h4b), 'data-midpoint-child-name-refusal') === 0 && S().roleNameRefusal === null);
// the holder's relating withdrawn while the refusal stands: the name goes, and the refusal with it (it cited a name no longer held)
S().nameRole(siteId, k2, N2); // refused again — the refusal stands on k2's card
S().withdrawRelating(edge.id, r1[0], r1[1], r1[2], dirOf(r1));
const h4c = render();
S().giveRelating(edge.id, r1[0], r1[1], r1[2], '+', dirOf(r1));
S().nameRole(siteId, k1, N2); // the name given back, for what follows
check('§4 ★★ A REFUSAL NEVER OUTLIVES THE NAME IT CITES (the review, 12:2x): the holder\'s relating withdrawn while the refusal stands takes the name — and the refusal no longer shows (it would cite a name nobody holds, by a key)',
  countOf(cardOf(h4c), 'data-midpoint-child-name-refusal') === 0 && !S().roleNames.some(([, , k, n]) => k === k2 && n === N2), { refusalShown: countOf(cardOf(h4c), 'data-midpoint-child-name-refusal') });
// EACH SHAPE KEEPS ITS OWN NAMES (the review, 12:2x): a second shape of the session holding the same site, where k1 does not stand
{
  const here = shape0();
  const other = { ...here, id: `${here.id}-without-r1`, edges: here.edges.map((e) => (e.id === edge.id ? withoutRelating(e, r1[0], r1[1], r1[2], dirOf(r1)) : e)) };
  useGeometryStore.setState({ shapes: { ...S().shapes, [other.id]: other }, shapeOrder: [...S().shapeOrder, other.id], currentShapeId: other.id });
  const k1Gone = !childSpaceOf(shape0(), siteId).roles.some((r) => r.id === k1);
  const before = J(S().roleNames.filter(([t]) => t === SH));
  const there = S().nameRole(siteId, k2, N2);
  const hThere = render();
  const recordThere = S().roleNames.filter(([t]) => t === other.id);
  S().withdrawRoleName(siteId, k2);
  const shapesAfter = { ...S().shapes }; delete shapesAfter[other.id];
  useGeometryStore.setState({ shapes: shapesAfter, shapeOrder: S().shapeOrder.filter((id) => id !== other.id), currentShapeId: here.id, roleNameRefusal: null });
  const hHere = render();
  check('§4 ★★ EACH SHAPE KEEPS ITS OWN NAMES (the review, 12:2x: one record across the generations let a name double and a withdrawal reach a shape it was never made in): every shape holds its own copy of each edge, and its own names — in a second shape where k1\'s relating does not stand, k2 takes the name k1 holds in Culture\'s shape, recorded for that shape alone and drawn there; Culture\'s record is untouched and draws k1 named, k2 not',
    k1Gone && there === null && J(recordThere) === J([[other.id, siteId, k2, N2]]) && textOf(rowOf(hThere, k2), 'data-midpoint-child-name') === N2 && J(S().roleNames.filter(([t]) => t === SH)) === before && textOf(rowOf(hHere, k1), 'data-midpoint-child-name') === N2 && countOf(rowOf(hHere, k2), 'data-midpoint-child-name') === 0 && !S().roleNames.some(([t]) => t === other.id),
    { k1Gone, there, recordThere, culture: S().roleNames });
}
const otherOk = S().nameRole(siteId, k2, N3);
check('§4 ★ A DIFFERENT NAME on the second role is taken', otherOk === null && J(S().roleNames) === J([[SH, siteId, k1, N2], [SH, siteId, k2, N3]]), S().roleNames);

// ═══ §5 A NAME GOES WITH ITS RELATING ═══
S().withdrawRelating(edge.id, r1[0], r1[1], r1[2], dirOf(r1));
const goneWith = S().roleNames;
const h5 = render();
S().giveRelating(edge.id, r1[0], r1[1], r1[2], '+', dirOf(r1));
const back = S().roleNames;
const h5b = render();
check('§5 ★★ A WITHDRAWN RELATING TAKES ITS NAME WITH IT (§9.38 (c)), in the same act, through the writer every relating goes through; the other role\'s name stays as it was; its row leaves the drawing',
  J(goneWith) === J([[SH, siteId, k2, N3]]) && rowOf(h5, k1) === '' && textOf(rowOf(h5, k2), 'data-midpoint-child-name') === N3,
  { names: goneWith });
check('§5 ★★ …AND THE NAME DOES NOT COME BACK when the relating is made again: the row stands again with its sentence alone — his to name again',
  J(back) === J([[SH, siteId, k2, N3]]) && rowOf(h5b, k1) !== '' && countOf(rowOf(h5b, k1), 'data-midpoint-child-name') === 0 && textOf(rowOf(h5b, k1), 'data-midpoint-child-sentence') === sentenceOf(r1),
  { names: back });
const ccSrc = fs.readFileSync(path.join(repoRoot, 'src/components/ChildCast.tsx'), 'utf8');
check('§5 ★ …AND NO DRAFT GIVES IT BACK (the review, 12:2x): a chosen role that leaves (its relating withdrawn) or loses its name leaves no rename and no typed name behind — made again, its field opens empty (by construction: the card resets both when the chosen role or its name goes); and the cast is remounted per site (`key={site.siteId}`)',
  /if \(chosenKey === null \|\| chosenName === null\) setRenaming\(null\);/.test(ccSrc) && /if \(chosenKey === null\) setDraft\(''\);/.test(ccSrc) && /<ChildCast key=\{site\.siteId\} /.test(fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8')));
const reuse = S().nameRole(siteId, k1, N2);
check('§5 ★ A NAME LET GO WITH ITS RELATING IS FREE: the guard counts only the roles that stand — the name that went with the withdrawn relating is taken again', reuse === null, { reuse, names: S().roleNames });
// …and a PAIR, through the pairing's own writer
const [px, py] = ['validity', 'possible'];
S().giveRolePair(edge.id, px, py);
const pairKey = `${px}≡${py}`;
const pairStands = childSpaceOf(shape0(), siteId).roles.some((r) => r.id === pairKey);
const pairNamed = pairStands ? S().nameRole(siteId, pairKey, 'cw-name of a pair') : 'no pair';
const hP = render();
S().withdrawRolePair(edge.id, px, py);
const afterPair = S().roleNames;
S().giveRolePair(edge.id, px, py);
const pairBack = S().roleNames;
check('§5 ★★ A PAIR TOO (the pairing\'s own writer): `validity ≡ possible` paired, named, its row reading the name over `(the validity ≡ the possible state)`; withdrawn, the name goes; paired again, it does not come back; the other names untouched',
  pairStands && pairNamed === null && textOf(rowOf(hP, pairKey), 'data-midpoint-child-name') === 'cw-name of a pair' && !afterPair.some(([, , k]) => k === pairKey) && !pairBack.some(([, , k]) => k === pairKey) && afterPair.length === 2,
  { pairStands, pairNamed, afterPair, row: textOf(rowOf(hP, pairKey), 'data-midpoint-child-sentence') });
S().withdrawRolePair(edge.id, px, py);

// ═══ §6 A NAME WITHDRAWN ═══
const logW = S().log.length;
S().withdrawRoleName(siteId, k2);
const eW = S().log[S().log.length - 1];
choose(k2);
const h6 = render();
check('§6 ★★ A NAME WITHDRAWN (the designer\'s 09:03 §2.1): the entry goes, one log line (`name` empty, `was` the name), and the same absence returns — the row reads its sentence alone, the card its sentence and an EMPTY field',
  !S().roleNames.some(([, , k]) => k === k2) && S().log.length === logW + 1 && eW.act === 'rolename' && eW.name === '' && eW.was === N3 && countOf(rowOf(h6, k2), 'data-midpoint-child-name') === 0 && textOf(cardOf(h6), 'data-midpoint-child-card-sentence') === sentenceOf(r2) && fieldOf(cardOf(h6)) === '',
  { names: S().roleNames, last: eW });

// ═══ §7 THE FILE ═══
const file = JSON.parse(JSON.stringify(S().exportWorkspace()));
const held = S().roleNames;
S().importWorkspace(ws);
const cleared = S().roleNames;
S().importWorkspace(file);
check('§7 ★★ THE NAMES RIDE THE FILE (as the bond rules do): exported `roleNames` holds his names exactly; a file without them (her 19:34 export) imports with none; the export imports back with them',
  J(file.roleNames) === J(held) && held.length > 0 && J(cleared) === '[]' && J(S().roleNames) === J(held),
  { exported: file.roleNames, cleared, back: S().roleNames });
const bad = validateWorkspaceImport({ ...file, roleNames: [[SH, siteId, k1]] });
check('§7 ★ A MALFORMED NAME IS REFUSED BY NAME at the import (four words each: the shape, the site, the role, the name)',
  bad.ok === false && bad.errors.includes("the file's role names is malformed"), bad.ok ? 'accepted' : bad.errors);

// ═══ §8 H · THE ZOOM ═══
choose(null);
const nat = childRowsOf(shape0(), siteId, childSpaceOf(shape0(), siteId), (k) => S().roleNames.find(([t, s, kk]) => t === SH && s === siteId && kk === k)?.[3] ?? null);
const h8 = render();
const svg8 = (ownOf(h8).match(/<svg data-midpoint-own-drawing="true"[^>]*>/) || [''])[0];
check('§8 ★★ IT OPENS WHOLE, NEVER ABOVE NATURAL SIZE (the designer\'s 09:33 §3): with no measured box (node) the drawing stands at its natural size — `data-midpoint-child-scale="1.000"`, width and height the rows\' own — `whole` marked, `zoom out` disabled (nothing is smaller than whole)',
  /data-midpoint-child-scale="1.000"/.test(svg8) && (() => { const m = svg8.match(/width="(\d+)" height="(\d+)" viewBox="0 0 (\d+) (\d+)"/); return !!m && +m[1] === +m[3] && +m[2] === Math.round(nat.height) && +m[4] === nat.height && +m[3] >= nat.width; })() && /data-midpoint-child-zoom="whole" data-midpoint-child-zoom-on="true"/.test(h8) && /disabled=""[^>]*>zoom out</.test(h8.replace(/data-midpoint-child-zoom="out" /, '')),
  { svg: svg8.slice(0, 200), nat });
choose(null, 1.5);
const h8b = render();
const svg8b = (ownOf(h8b).match(/<svg data-midpoint-own-drawing="true"[^>]*>/) || [''])[0];
check('§8 ★★ ZOOMED IN, THE DRAWING SCALES AS ONE (its viewBox unchanged, its size the scale\'s): at 1.5 the width and height are 1.5 × the rows\', `whole` no longer marked, `zoom out` offered',
  /data-midpoint-child-scale="1.500"/.test(svg8b) && (() => { const m = svg8b.match(/width="(\d+)" height="(\d+)" viewBox="0 0 (\d+) (\d+)"/); return !!m && +m[1] === Math.round(+m[3] * 1.5) && +m[2] === Math.round(nat.height * 1.5) && +m[4] === nat.height; })() && !/data-midpoint-child-zoom-on="true"/.test(h8b) && !/disabled=""[^>]*>zoom out</.test(h8b),
  svg8b.slice(0, 200));
const fitBig = wholeScaleOf(697, 411, 518, 424);
const fitSmall = wholeScaleOf(697, 411, 300, 100);
check('§8 ★ THE FIT: whole is the box over the drawing, both ways, never above 1 — 697 × 411 over 518 × 424 fits at 409 / 424; a small drawing stays at 1',
  Math.abs(fitBig - 409 / 424) < 1e-9 && fitSmall === 1, { fitBig, fitSmall });
const src = fs.readFileSync(path.join(repoRoot, 'src/components/ChildCast.tsx'), 'utf8');
const writes = [...src.matchAll(/setChildView\(\{ siteId, key: [^,]+, scale: ([^ }]+) \}\)/g)].map((m) => m[1]);
check('§8 ★★ THE SIZE NEVER CHANGES BY ITSELF (by construction): the view\'s scale is written in five places only — `whole` (his button, and once when the box is first measured, only while the scale is unset and never while the tab is hidden: a hidden box measures 0 × 0), `s` (his zoom in · zoom out · ctrl + wheel, bounded by 2 above and below by whole — or by the scale as it stands where whole has grown past it, so `zoom out` never enlarges, and is disabled there), and the scale as it stands (his choosing a role keeps it, and so does his pressing a relation in the strip, slice 2 · E); the wheel zooms only with ctrl (the wheel alone scrolls); a drag must move 4 px before it pans, and a drag never chooses',
  J(writes.slice().sort()) === J(['s', 'view.scale', 'view.scale', 'whole', 'whole']) && /if \(box && view\.scale === null\) setChildView/.test(src) && /if \(!ev\.ctrlKey\) return;/.test(src) && /Math\.hypot\(dx, dy\) > 4/.test(src) && /if \(dragged\.current\) return;/.test(src) && /Math\.max\(Math\.min\(whole, scale\), Math\.min\(MAX_SCALE, next\)\)/.test(src) && /disabled=\{atLeast\}/.test(src) && /const atLeast = scale <= whole \+ 0\.001;/.test(src) && /if \(el\.offsetWidth === 0 \|\| el\.offsetHeight === 0\) return;/.test(src),
  writes);

// ═══ §9 THE NAME DESIGNATES ONLY ═══
const readers = [];
const walk = (dir) => { for (const f of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, f.name); if (f.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f.name) && /roleNames/.test(fs.readFileSync(p, 'utf8'))) readers.push(path.relative(repoRoot, p).replace(/\\/g, '/')); } };
walk(path.join(repoRoot, 'src'));
check('§9 ★★ THE NAME DESIGNATES ONLY (§9.38 (c): it touches no instance, no induced value, no path, no verdict, no sorting) — BY CONSTRUCTION: `roleNames` is held by the store, carried by the file and read by the child\'s cast alone; no reader of relatings, paths, sortings or the next generation names it',
  J(readers.sort()) === J(['src/components/ChildCast.tsx', 'src/lib/workspacePersistence.ts', 'src/store/geometryStore.ts']), readers);
const srcAll = readers.concat(['src/components/MidpointSurface.tsx']).map((p) => fs.readFileSync(path.join(repoRoot, p), 'utf8')).join('\n');
check('§9 ★ NO STAND-IN NAME ON THE PAGE (the designer\'s 09:05): the source proposes no name — the field opens empty, nothing is minted', !/market value/.test(srcAll) && !/placeholder="[^"]*"/.test(src));

// ═══ §10 EVERY ROUTE BY WHICH A RELATING STOPS STANDING TAKES ITS NAME (the review, 12:2x) — and the file read against its shapes ═══
{
  // the import: a name whose relating does not stand, a second name for one role, a name another role holds — each NOT TAKEN, by name; the rest taken
  const good = [SH, siteId, k1, 'cw-file one'];
  const ws10 = { ...ws, roleNames: [good, [SH, siteId, 'not a relating here', 'cw-file two'], [SH, siteId, k1, 'cw-file three'], [SH, siteId, k2, 'cw-file one']] };
  const nt = S().importWorkspace(ws10);
  check('§10 ★★ A FILE\'S NAMES ARE READ AGAINST ITS SHAPES (the store\'s guard, which a file never passed through): a name whose relating does not stand, a second name for one role and a name another role at that site holds are each NOT TAKEN, by name — `the name "cw-file two" at Culture: its relating does not stand there` — and the rest is taken',
    J(S().roleNames) === J([good]) && nt.length === 3 && nt[0] === 'the name "cw-file two" at Culture: its relating does not stand there' && nt.slice(1).every((l) => /^the name "cw-file (three|one)" at Culture: another role there holds it, or that role is named already$/.test(l)),
    { names: S().roleNames, notTaken: nt });
  // a cast edited so a role leaves: its relating becomes a stray (carried, marked, no role of the child) — and its name goes; the role back, no name
  S().selectVertex(X);
  const cast0 = castOf(X);
  S().updateSelectedVertexData({ cast: { ...cast0, roles: cast0.roles.filter((r) => r.id !== r1[1]) } });
  const afterEdit = S().roleNames;
  S().updateSelectedVertexData({ cast: cast0 });
  const k1Back = childSpaceOf(shape0(), siteId).roles.some((r) => r.id === k1);
  check('§10 ★★ A CAST EDITED SO A ROLE LEAVES: the relating through it is no role of the child any more (a stray, carried and marked) and its name goes with it; the cast restored, the relating stands again with no name — never back by itself',
    afterEdit.length === 0 && k1Back && S().roleNames.length === 0, { afterEdit, k1Back, names: S().roleNames });
  // the dissection: the new shape starts with the names of the relatings it carries; afterwards each shape lives by its own acts; an undo takes back
  // what the dissection brought, names with the record
  S().nameRole(siteId, k1, 'cw-carried');
  S().selectCell(shape0().cells.find((c) => c.kind === 'core').id);
  S().applyAmboDissectionToCurrent();
  const g2id = S().currentShapeId;
  const carried = S().roleNames.filter(([t]) => t === g2id);
  const g2edge = shape0().edges.find((e) => e.vertexIds.includes(X) && e.vertexIds.includes(Y));
  const standsG2 = !!g2edge && childSpaceOf(shape0(), siteId)?.roles.some((r) => r.id === k1);
  if (g2edge) S().withdrawRelating(g2edge.id, r1[0], r1[1], r1[2], dirOf(r1));
  const afterG2Withdraw = S().roleNames;
  check('§10 ★★ THE DISSECTION CARRIES THE NAMES INTO THE NEW SHAPE (once, when it is first made), and then each shape lives by its own acts: the relating withdrawn in the new shape takes its name there, and Culture\'s shape keeps its own',
    g2id !== SH && standsG2 && J(carried) === J([[g2id, siteId, k1, 'cw-carried']]) && J(afterG2Withdraw) === J([[SH, siteId, k1, 'cw-carried']]),
    { g2id, standsG2, carried, afterG2Withdraw });
  S().undoWorkspace();
  check('§10 ★★ AN UNDO TAKES THE NAMES BACK WITH THE RECORD (the names ride the undo snapshot, as the log does): undoing the dissection returns Culture\'s shape with its names as they stood when it was taken',
    S().currentShapeId === SH && J(S().roleNames) === J([[SH, siteId, k1, 'cw-carried']]), { current: S().currentShapeId, names: S().roleNames });
  S().resetWorkspace();
  check('§10 ★ A RESET STARTS WITH NO NAMES (its seed holds no relating; the vertex ids recur, so a kept name would come back with a relating made again)',
    S().roleNames.length === 0 && S().childView === null && S().roleNameRefusal === null, { names: S().roleNames });
}

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-CHILDS-CAST: ALL PASS — slice 2 A and H on Culture: one row per role read by its sentence, D4 never drawn; his name given, kept with its sentence, refused by name when another role holds it, gone with its relating and never back by itself, withdrawn, riding the file; the zoom opening whole and moved only by his acts');
else { console.log(`DIAGNOSE-THE-CHILDS-CAST: ${failures} FAIL`); process.exitCode = 1; }

#!/usr/bin/env node
'use strict';
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// THE DEPENDENCE KIND — ADR 0031 §9.64 (3) (Arman's "b", Δ216; the spend on the cast's type Δ221; the mothership's 14:04 STAMP and its 14:10 / 14:12 / 14:15
// MARKERS; the designer's 14:08 form, part 3). THE MECHANISM: the reader takes `dependence_signature` and `dependences` and checks them as structure — closure,
// arity, consistency; two refusals at the load — one spelling in both lists, and a cast that would turn a word standing as a way at the corner into a dependence,
// naming the uses; the refusal by name wherever a way's word is typed, at the act and as the field's live line; every way-reader blind BY CONSTRUCTION. HELD
// until Arman's design (the mothership's 14:12): the load line's count, the block under the drawing, the card's row — pinned here as UNCHANGED.
// THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the loader, the store's acts and the readers are RUN on Virgin Land's v7 casts (as found), the coder's 14:00
// two-part variant and four casts poured for the checks. LAW 24: every refusal beside the file that loads, every blind reader beside a reader that sees.
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
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
const { readCastFile, castMarks, castSummaryLine, notTakenAddresses } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { lexiconOf, NO_FACTS, relatingsHeld } = req('src/lib/relatings.ts');
const { insideOf } = req('src/lib/castInside.ts');
const { spaceCounts } = req('src/lib/spaceOf.ts');
const { dependenceWordsOf, dependenceCornersOf, dependenceRefusal } = req('src/lib/dependenceWords.ts');
const { DependenceLine } = req('src/components/WordField.tsx');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const count = (s, needle) => s.split(needle).length - 1;
const fixture = (name) => fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8');
const load = (name) => readCastFile(fixture(name));

console.log("THE DEPENDENCE KIND — read as structure, refused as a way, blind by construction; the count, the drawing and the card held (ADR 0031 §9.64 (3))\n");

// ═══ §1 THE READER TAKES THE TWO PARTS ═══
const v7 = load('production-v7-two-parts.cast.json'); const v6 = load('vl-v6-production.cast.json'); const vlP = load('vl-v7-production.cast.json'); const vlF = load('vl-v7-finance.cast.json');
check('§1 ★★ THE TWO PARTS ARE READ, NOT CARRIED: the coder\'s 14:00 variant of Production (one `requires` held, one denied) loads with `dependenceSignature` [requires, 2] and two `dependences` on its own role ids — and neither key rides the warrant any more',
  v7.taken && J(v7.cast.dependenceSignature) === J([{ type: 'requires', arity: 2 }]) && v7.cast.dependences.length === 2 && v7.cast.dependences[0].polarity === 'holds' && J(v7.cast.dependences[0].terms) === J(['working', 'capacity']) && v7.cast.dependences[1].polarity === 'does-not-hold'
    && !!v7.cast.warrant && !('dependence_signature' in (v7.cast.warrant.file || {})) && !('dependences' in (v7.cast.warrant.file || {})) && 'concept' in (v7.cast.warrant.file || {}),
  v7.taken ? { signature: v7.cast.dependenceSignature, dependences: v7.cast.dependences.map((d) => [d.type, d.terms, d.polarity]), warrantFile: Object.keys(v7.cast.warrant.file || {}) } : v7);
check('§1 ★★ LAW 24 — A CAST BEFORE MOLD v7 HOLDS NEITHER FIELD (absent = absent, never filled): Virgin Land\'s v6 Production loads with no `dependenceSignature` and no `dependences`',
  v6.taken && v6.cast.dependenceSignature === undefined && v6.cast.dependences === undefined, v6.taken ? Object.keys(v6.cast) : v6);
check('§1 ★★ VIRGIN LAND\'S v7 CASTS AS SHE POURED THEM (her folder of 14:56, refreshed 10-21 — the 14:49 copies predated the denial she added; Production 12 dependences in 5 words, one denied, Finance 5 in 3, `is secured on` among them): read, closed on their roles, every word in its dependence signature (no mark)',
  vlP.taken && vlP.cast.dependenceSignature.length === 5 && vlP.cast.dependences.length === 12 && vlP.cast.dependences.filter((d) => d.polarity === 'does-not-hold').length === 1 && vlF.taken && vlF.cast.dependenceSignature.length === 3 && vlF.cast.dependences.length === 5 && dependenceWordsOf(vlF.cast).includes('is secured on')
    && castMarks(vlP.cast).filter((m) => /^dependence/.test(m)).length === 0 && castMarks(vlF.cast).filter((m) => /^dependence/.test(m)).length === 0,
  { production: vlP.taken && [dependenceWordsOf(vlP.cast), vlP.cast.dependences.length, castMarks(vlP.cast)], finance: vlF.taken && [dependenceWordsOf(vlF.cast), vlF.cast.dependences.length, castMarks(vlF.cast)] });
check('§1 ★★ THE COUNT, COUNTED APART (Arman\'s design, Δ226; the designer\'s 15:41 — the count held since the mothership\'s 14:12 is released): the two-part variant\'s summary line is the v6 cast\'s with ONE part added beside the relations, `· 2 dependences in 1 word`; the v6 cast\'s line names none',
  v7.taken && v6.taken && castSummaryLine(v7.cast) === castSummaryLine(v6.cast).replace(' in 12 words · ', ' in 12 words · 2 dependences in 1 word · ') && !/dependence/.test(castSummaryLine(v6.cast)), castSummaryLine(v7.cast));

// ═══ §2 CHECKED AS STRUCTURE: closure, arity, consistency; the two refusals at the load ═══
const broken = load('dependence-closure-broken.cast.json');
check('§2 ★★ CLOSURE AND ARITY on the dependences, marked never refused, in the relations\' words: `dependence 0: "ghost" isn\'t a role in this cast` · `dependence 1: "needs" isn\'t in the cast\'s dependence signature` · `1 dependence with the wrong number of terms`',
  broken.taken && J(castMarks(broken.cast)) === J(['dependence 0: "ghost" isn\'t a role in this cast', 'dependence 1: "needs" isn\'t in the cast\'s dependence signature', '1 dependence with the wrong number of terms']), broken.taken ? castMarks(broken.cast) : broken);
const contra = load('dependence-contradictory.cast.json');
check('§2 ★★ CONSISTENCY: a dependence held and denied in one word refuses the cast, the tuple named — the record is a function, for dependences as for relations',
  !contra.taken && contra.refusal === 'not taken — the file gives one tuple two values: requires(working, capacity) is listed as holding and as not holding', contra);
const both = load('dependence-both-lists.cast.json');
check('§2 ★★ REFUSAL (3) AT THE LOAD — ONE SPELLING, TWO KINDS (the designer\'s 14:08; the mothership\'s 14:10): `not taken — "requires" is both a way\'s word and a dependence\'s word in this cast`',
  !both.taken && both.refusal === 'not taken — "requires" is both a way\'s word and a dependence\'s word in this cast', both);
const mal = load('dependence-malformed.cast.json');
check('§2 ★ A MALFORMED ITEM is declined by name and carried beside its mark, the rest taken: a dependence signature entry with no arity, a dependence with no terms, one with a polarity that is neither — three addresses in the not-taken clause; one word and one dependence taken',
  mal.taken && mal.declined.includes('dependence signature entry 1 (no type, or no whole number of terms)') && mal.declined.includes('dependence 1 (no type or no terms)') && mal.declined.includes('dependence 2 (its polarity "maybe" is neither holds nor does not hold)')
    && J(notTakenAddresses(mal.cast)) === J(['dependence signature entry 1', 'dependence 1', 'dependence 2']) && mal.cast.dependenceSignature.length === 1 && mal.cast.dependences.length === 1,
  mal.taken ? { declined: mal.declined, addresses: notTakenAddresses(mal.cast) } : mal);

// ═══ §3 THE REFUSAL BY NAME AT THE ACTS — the store, run ═══
const cast = (name) => load(name).cast;
const flow = cast('flow.cast.json'); const phi = cast('phi.cast.json'); const prod7 = v7.cast; const fin7 = vlF.cast;
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
let seeded = createSeedShape('tetrahedron');
for (const [label, c] of [['A', prod7], ['B', phi], ['C', flow], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, log: [], relatingRefusals: {}, altitudeRefusals: {} });
const A = byLabel(cur(), 'A'); const B = byLabel(cur(), 'B'); const C = byLabel(cur(), 'C'); const D = byLabel(cur(), 'D');
const eAB = edgeBetween(cur().edges, A, B); const eCD = edgeBetween(cur().edges, C, D);
const roleOf = (shape, corner) => shape.vertices[corner].data.cast.roles[0].id;
const faceABC = cur().faces.find((f) => f.vertexIds.length === 3 && [A, B, C].every((v) => f.vertexIds.includes(v)));
S().declareMode('carries');
check('§3 ★ THE ONE READER: `requires` names a dependence at A (Production\'s two-part cast) and nowhere else; the sentence is the designer\'s, with the corner\'s name',
  J(dependenceCornersOf(cur(), [A, B, C, D], 'requires')) === J([A]) && dependenceRefusal(cur(), [A, B], 'requires') === '"requires" names a dependence in A\'s cast, not a way' && dependenceRefusal(cur(), [C, D], 'requires') === null && dependenceRefusal(cur(), [A, B], 'carries') === null,
  { at: dependenceCornersOf(cur(), [A, B, C, D], 'requires'), words: dependenceWordsOf(prod7) });
const rDep = S().giveRelating(eAB.id, 'requires', eAB.vertexIds[0] === A ? roleOf(cur(), A) : roleOf(cur(), B), eAB.vertexIds[0] === A ? roleOf(cur(), B) : roleOf(cur(), A), '+');
const rWay = S().giveRelating(eAB.id, 'carries', eAB.vertexIds[0] === A ? roleOf(cur(), A) : roleOf(cur(), B), eAB.vertexIds[0] === A ? roleOf(cur(), B) : roleOf(cur(), A), '+');
check('§3 ★★ THE RELATING: `requires` on A–B is refused by name — `"requires" names a dependence in A\'s cast, not a way` — and nothing is written; `carries` on the same roles is taken (LAW 24)',
  !!rDep && rDep.why === '"requires" names a dependence in A\'s cast, not a way' && !relatingsHeld(edgeBetween(cur().edges, A, B)).some((r) => r[0] === 'requires') && rWay === null && relatingsHeld(edgeBetween(cur().edges, A, B)).some((r) => r[0] === 'carries'),
  { refused: rDep, taken: rWay, held: relatingsHeld(edgeBetween(cur().edges, A, B)).map((r) => r[0]) });
const lexAfterRelating = lexiconOf(cur(), S().lexicon, NO_FACTS); // read here, before the rule control at C–D (which lawfully declares the word there)
const rFar = S().giveRelating(eCD.id, 'requires', eCD.vertexIds[0] === C ? roleOf(cur(), C) : roleOf(cur(), D), eCD.vertexIds[0] === C ? roleOf(cur(), D) : roleOf(cur(), C), '+');
check('§3 ★★ THE SCOPE (the mothership\'s 14:10): on C–D, where neither cast names it, `requires` is no dependence word — the act is not refused on that ground (casts\' words are foreign until he translates, §9.64 (8))',
  rFar === null || !/names a dependence/.test(rFar.why), rFar);
const twice = withCast(cur(), B, prod7);
useGeometryStore.setState({ shapes: { [twice.id]: twice } });
check('§3 ★ BOTH CORNERS HOLDING THE WORD: `"requires" names a dependence in A\'s and B\'s casts, not a way`',
  dependenceRefusal(cur(), [A, B], 'requires') === '"requires" names a dependence in A\'s and B\'s casts, not a way');
useGeometryStore.setState({ shapes: { [seeded.id]: withCast(cur(), B, phi) } });
const ruleAt = S().nameRule('carries', 'turns into', 'requires', 'chain', undefined, eAB.id);
const ruleFar = S().nameRule('carries', 'turns into', 'requires', 'chain', undefined, eCD.id);
check('§3 ★★ THE RULE, at the edge he names it at: a result word that is a dependence word of either corner\'s cast is refused by name at A–B and taken at C–D (then withdrawn)',
  ruleAt === '"requires" names a dependence in A\'s cast, not a way' && ruleFar === null && S().rules.some((r) => r[2] === 'requires'), { at: ruleAt, far: ruleFar });
S().withdrawRule('carries', 'turns into', 'chain');
const say = S().giveAltitudeSaying(faceABC.id, A, B, roleOf(cur(), A), 'requires', roleOf(cur(), B), '+');
const sayFar = S().giveAltitudeSaying(faceABC.id, C, B, roleOf(cur(), C), 'requires', roleOf(cur(), B), '+');
check('§3 ★★ THE LIGHT\'S SAYING: in A\'s light, `requires` is refused by name (the speaking corner\'s cast); in C\'s light at the same end it is not a dependence word (taken, or refused on another ground)',
  !!say && say.why === '"requires" names a dependence in A\'s cast, not a way' && (sayFar === null || !/names a dependence/.test(sayFar.why)), { say, sayFar });
if (sayFar === null) S().withdrawAltitudeSaying(faceABC.id, C, B, roleOf(cur(), C), 'requires', roleOf(cur(), B));
S().giveWordPair(eAB.id, 'requires', phi.signature[0].type);
const pairRefusal = S().midpointRefusals[eAB.id];
check('§3 ★★ THE TRANSLATION: pairing `requires` (A\'s dependence word) with a way of B is refused with the same sentence — a translation makes two WAYS one word',
  !!pairRefusal && pairRefusal.form === '"requires" names a dependence in A\'s cast, not a way', pairRefusal && { act: pairRefusal.act, form: pairRefusal.form });

// ═══ §3b THE SECOND REFUSAL AT THE LOAD — a standing way turned into a dependence ═══
S().declareMode('is secured on');
useGeometryStore.setState({ shapes: { [seeded.id]: withCast(cur(), A, flow) }, midpointRefusals: {} });
const xA = eAB.vertexIds[0] === A ? roleOf(cur(), A) : roleOf(cur(), B); const yB = eAB.vertexIds[0] === A ? roleOf(cur(), B) : roleOf(cur(), A);
const given = S().giveRelating(eAB.id, 'is secured on', xA, yB, '+');
S().selectVertex(A);
const refusedLoad = S().updateSelectedVertexData({ cast: fin7 });
check('§3b ★★ A CAST THAT WOULD TURN A STANDING WAY INTO A DEPENDENCE IS REFUSED AT THE LOAD, NAMING THE USE (the designer\'s 14:08; the mothership\'s 14:10): `is secured on` recorded on A–B as a way; Virgin Land\'s v7 Finance, where it is a dependence word, loaded on A — `"is secured on" names a dependence in this cast, and it is used as a way here: 1 relating`, the relating listed as he said it; the corner keeps its cast',
  given === null && !!refusedLoad && refusedLoad.why === '"is secured on" names a dependence in this cast, and it is used as a way here: 1 relating' && refusedLoad.items.length === 1 && refusedLoad.items[0].kind === 'relating' && /^on A–B: .+ is secured on .+$/.test(refusedLoad.items[0].words) && cur().vertices[A].data.cast.roles.length === flow.roles.length,
  { given, refusedLoad, cast: cur().vertices[A].data.cast.roles.length });
S().withdrawRelating(eAB.id, 'is secured on', xA, yB);
const takenLoad = S().updateSelectedVertexData({ cast: fin7 });
check('§3b ★ LAW 24 — the relating withdrawn, the same cast loads on A, and A holds Finance\'s five dependences',
  takenLoad === null && (cur().vertices[A].data.cast.dependences || []).length === 5, { takenLoad, dependences: (cur().vertices[A].data.cast.dependences || []).length });

// ═══ §4 EVERY WAY-READER BLIND BY CONSTRUCTION ═══
const walk = (dir, out = []) => { for (const f of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, f.name); if (f.isDirectory()) walk(p, out); else if (/\.tsx?$/.test(f.name)) out.push(p); } return out; };
const naming = walk(path.join(repoRoot, 'src')).filter((p) => /\bdependenceSignature\b|\bdependences\b/.test(fs.readFileSync(p, 'utf8'))).map((p) => path.relative(repoRoot, p).replace(/\\/g, '/')).sort();
const allowed = ['src/components/Panels.tsx', 'src/lib/castInside.ts', 'src/lib/castLoader.ts', 'src/lib/dependenceWords.ts', 'src/store/geometryStore.ts', 'src/types/geometry.ts']; // Panels: the card's `dependences` row — its label and its counts through `castCounts`, never a field (Δ226, "counted apart") // the store says the word in its load refusal's sentences and reaches no field (pinned below); the inside reads the second part for the WIRING alone (Δ226 — the under-layer and the counts, never the arcs, loops, nodes or words)
const wayReaders = ['src/lib/instanceSpace.ts', 'src/lib/childLoops.ts', 'src/lib/spaceOf.ts', 'src/lib/midpointGlue.ts', 'src/lib/respects.ts', 'src/lib/jRegister.ts', 'src/lib/faceReading.ts', 'src/lib/configuration.ts', 'src/lib/walkRoutes.ts', 'src/lib/sorting.ts', 'src/lib/cargoModel.ts', 'src/manuscript/identificationImageModel.ts'];
check('§4 ★★ BLIND BY CONSTRUCTION — the two fields are named by the type, the loader, the one reader of dependence words and the drawing\'s under-layer (Δ226: the wiring and the counts, never the plane), and by NO reader of ways: the census of `src/` names exactly those four files and the store, which says the word in its load refusal\'s sentences and reaches the fields only through `dependenceWordsOf` (never a field); every way-reader (the child, the loops, the resolver, the glue, the respects, the register, the face, the configuration, the walk, the sorting, the cargo, the image) holds no such token; the inside\'s plane read with and without the second part is the same (run below, §7)',
  J(naming) === J(allowed) && !/\.dependence(s|Signature)\b/.test(src('src/store/geometryStore.ts')) && wayReaders.every((p) => !fs.existsSync(path.join(repoRoot, p)) || !/dependence/i.test(src(p))),
  { naming, wayReadersNaming: wayReaders.filter((p) => fs.existsSync(path.join(repoRoot, p)) && /dependence/i.test(src(p))) });
const inside = insideOf(prod7);
check('§4 ★★ THE READERS, RUN: the drawing of the two-part cast draws no arc, loop, node or badge in `requires` and lists it among no words (nothing of it drawn — held, and blind); the space\'s word count is the signature\'s; the lexicon right after the refused relating holds no `requires` (the rule control at C–D declares it there later, lawfully)',
  ![...inside.arcs, ...inside.loops, ...inside.nodes].some((x) => x.type === 'requires') && !inside.points.some((p) => p.badges.some((b) => b.key === 'requires')) && !inside.words.includes('requires') && spaceCounts(prod7).words === prod7.signature.length && !lexAfterRelating.includes('requires'),
  { words: inside.words, lexiconAfterTheRefusedRelating: lexAfterRelating });

// ═══ §5 THE FIELD'S LIVE LINE, and every field mounts it ═══
const line = renderToString(React.createElement(DependenceLine, { why: '"requires" names a dependence in Production\'s cast, not a way', at: 'x|y|0' }));
check('§5 ★★ THE LINE: one element carrying the sentence and its place, a row of its own (`basis-full`), in the refusal\'s ink, nothing pressable; nothing where the word names no dependence',
  /^<span data-dependence-refusal="x\|y\|0" class="basis-full text-rose-300">not taken — "requires" names a dependence in Production's cast, not a way<\/span>$/.test(line.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")) && renderToString(React.createElement(DependenceLine, { why: null, at: 'x' })) === '', line);
const files = { 'src/components/MediumBlock.tsx': 4, 'src/components/MidpointSurface.tsx': 1, 'src/components/PairingTab.tsx': 1, 'src/components/ChildLoopCard.tsx': 1 };
const census = Object.entries(files).map(([p, want]) => { const s = src(p); const whens = (s.match(/<NewWordNorm when=\{([^}]*)\}/g) || []).map((m) => m.replace(/^<NewWordNorm when=\{|\}$/g, '')); return { file: p, want, lines: count(s, '<DependenceLine '), norms: count(s, '<NewWordNorm '), yields: whens.every((w) => /dependence === null/.test(w)) || (p.endsWith('PairingTab.tsx') || p.endsWith('MidpointSurface.tsx')) && /const newWord = isNewWord\([^;]*&& dependence === null;/.test(s) }; });
check('§5 ★★ EVERY FIELD WHERE A WAY\'S WORD IS CHOSEN MOUNTS THE LINE BESIDE THE NORM\'S, FILE BY FILE (the seven of SLICE 3 · A), and the norm\'s line yields to it (its predicate carries `dependence === null`) — in place of, never beside',
  census.every((c) => c.lines === c.want && c.norms === c.want && c.yields), census);

// ═══ §6 THE ACTS, BY CONSTRUCTION — each act asks the one reader with its own corners (the mothership's 14:10 scope) ═══
const rel = src('src/lib/relatings.ts'); const alt = src('src/lib/altitude.ts'); const store = src('src/store/geometryStore.ts'); const medium = src('src/components/MediumBlock.tsx');
check('§6 ★★ THE ACTS: the relating (the edge\'s two corners), the light\'s saying (the speaking corner and the end), the bond\'s relation word (the light\'s cast), the decision (the passage\'s two ends), the two rules at the edge he names them at (the fields pass it), the loop\'s answer and rule (the loop\'s two parents), the translation (its two words) — all through `dependenceRefusal`',
  rel.includes('const dependence = dependenceRefusal(shape, [X, Y], mode);') && alt.includes('const dependence = dependenceRefusal(shape, [apex, end], word);') && alt.includes('const dependenceS = dependenceRefusal(shape, [apex], S);')
    && store.includes('const dependence = dependenceRefusal(shape, [face.vertexIds[i], face.vertexIds[j]], w3);') && count(store, 'dependenceRefusal(shape, [at.L.X, at.L.Y], word)') === 2 && count(store, 'dependenceRefusal(sh, e.vertexIds, a) ?? dependenceRefusal(sh, e.vertexIds, ') === 2
    && store.includes('const dependenceWord = dependenceRefusal(shape, [edge.vertexIds[0]], s) ?? dependenceRefusal(shape, [edge.vertexIds[1]], w);') && medium.includes('nameRule(k.w, k.w2, typed, k.shape, sameWord || order === null ? undefined : order, m.edge.id)') && medium.includes('nameBondRule(b.w, b.S, b.w2, typed, m.edge.id)'));

// ═══ §6 A WORD REFUSED AS A DEPENDENCE IS ASKED NOTHING AND OFFERED NO ACT (measured 10-21 on the fresh seed: `requires` typed at A–B was refused AND asked `which way it reads`) ═══
const pairing = src('src/components/PairingTab.tsx'); const loopCard = src('src/components/ChildLoopCard.tsx'); const surface = src('src/components/MidpointSurface.tsx'); const mediumSrc = src('src/components/MediumBlock.tsx');
check('§6 ★★ BY CONSTRUCTION: every field that asks a word\'s way or offers its act yields to the dependence refusal — the pairing tab (`asks`, `isReady`), the say and the bond say (`asks`, `bondAsks`, `decide`), the rule and the bond rule (`ruleAsks`, `name`), the loop\'s answer (`asks`, `decide`, Enter), the light\'s saying (`live`, the ready drafts): each predicate carries `dependence === null`, or reads the refusal on the draft; the refusal line is the field\'s whole answer and the store\'s refusal at the act (§3) is the backstop',
  /const asks = dependence === null && w\.length > 0/.test(pairing) && /&& dependenceRefusal\(shape, edgeCorners, wordOf\(d\)\) === null;/.test(pairing)
    && /const asks = typed\.length > 0 && dirHere === null && dependence === null;/.test(mediumSrc) && /typed && dirHere !== null && dependence === null \? <>\{' · '\}<button type="button" data-medium-say="composed"/.test(mediumSrc)
    && /const bondAsks = typed\.length > 0 && bondDir === null && dependence === null;/.test(mediumSrc) && /typed && bondDir !== null && dependence === null \? <>\{' · '\}<button type="button" data-medium-bond-say="composed"/.test(mediumSrc)
    && /const ruleAsks = typed\.length > 0 && !sameWord && order === null && dependence === null;/.test(mediumSrc) && /typed && dependence === null && \(sameWord \|\| order !== null\) \? <>\{' · '\}<button type="button" data-medium-rule-name=\{id\}/.test(mediumSrc) && /typed && dependence === null \? <>\{' · '\}<button type="button" data-medium-bond-rule-name=\{id\}/.test(mediumSrc)
    && /const asks = word\.length > 0 && dirHere === null && dependence === null;/.test(loopCard) && /dirHere !== null && dependence === null\) say\(d, way, t\.trim\(\), view\.scope, dirHere\)/.test(loopCard) && /\{t\.trim\(\) && dependence === null \? <><span>·<\/span><button type="button" data-child-loop-decide-it=/.test(loopCard)
    && /const live = d\.word\.trim\(\)\.length > 0 && d\.sign !== null && dependence === null;/.test(surface) && /\(light === null \|\| dependenceRefusal\(shape, \[light, end\], d\.word\) === null\)\) : \[\];/.test(surface),
  { pairing: /const asks = dependence === null && w\.length > 0/.test(pairing), medium: /dirHere === null && dependence === null;/.test(mediumSrc), loop: /dirHere === null && dependence === null;/.test(loopCard), surface: /d\.sign !== null && dependence === null;/.test(surface) });

// ═══ §7 BUILT ON HIS DESIGN (Δ226, "good. proceed"; the designer's 15:41; the mothership's 15:44) — THE WIRING UNDERNEATH: the model, the channel, the drawing ═══
{
  const { insideGeometry, InsideColumn } = req('src/components/CastInsideDiagram.tsx');
  const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const prodV7 = vlP.cast; // her Production as she poured it (14:56): 12 tuples in 5 words, one denied — the drawing's case
  const bare = { ...prodV7, dependences: undefined, dependenceSignature: undefined };
  const withWires = insideOf(prodV7); const without = insideOf(bare);
  const plane = (ins) => J({ points: ins.points.map((p) => [p.id, p.label, p.badges]), arcs: ins.arcs, loops: ins.loops, nodes: ins.nodes, words: ins.words, unplaced: ins.unplaced });
  const tuples = (prodV7.dependences || []).filter((d) => d.terms.length === 2 && d.terms.every((t) => prodV7.roles.some((r) => r.id === t)));
  const pairs = new Set(tuples.filter((d) => d.terms[0] !== d.terms[1]).map((d) => `${d.terms[0]}>${d.terms[1]}|${d.polarity === 'does-not-hold' ? 'denied' : 'holds'}`));
  check('§7 ★★ THE MODEL: her Production (14:56) draws its dependences as WIRES — one per ordered pair and polarity, the words joined (' + tuples.length + ' tuples in ' + new Set(tuples.map((d) => d.type)).size + ' words → ' + pairs.size + ' wires); the plane (points, arcs, loops, nodes, words) is the SAME with the second part and without it — the way-readers blind, run',
    withWires.wires.length === pairs.size && withWires.dependenceTuples.length === tuples.length && withWires.dependenceTuples.every((t, i) => t.from === tuples[i].terms[0] && t.to === tuples[i].terms[1] && t.word === tuples[i].type) && withWires.census.dependences === tuples.length && withWires.census.dependenceWords === new Set(tuples.map((d) => d.type)).size && withWires.census.wires === pairs.size && withWires.wires.every((w) => w.words.length >= 1 && w.from !== w.to) && without.wires.length === 0 && without.census.dependences === 0 && plane(withWires) === plane(without),
    { wires: withWires.wires.length, pairs: pairs.size, dependences: withWires.census.dependences, words: withWires.census.dependenceWords, samePlane: plane(withWires) === plane(without) });
  const gL = insideGeometry(withWires, { px: 0, top: 14, channelSide: -1 }); const gR = insideGeometry(withWires, { px: 0, top: 14, channelSide: 1 }); const g0 = insideGeometry(without, { px: 0, top: 14 });
  const overlap = (g) => { const byLane = new Map(); withWires.wires.forEach((w, i) => { const lo = Math.min(g.yOf(w.from), g.yOf(w.to)), hi = Math.max(g.yOf(w.from), g.yOf(w.to)); const k = g.channel.laneOf(i); (byLane.get(k) || byLane.set(k, []).get(k)).push([lo, hi]); }); let bad = 0; for (const runs of byLane.values()) for (let a = 0; a < runs.length; a += 1) for (let b = a + 1; b < runs.length; b += 1) if (!(runs[a][1] + 6 < runs[b][0] || runs[a][0] - 6 > runs[b][1])) bad += 1; return bad; };
  check('§7 ★★ THE CHANNEL: on the column\'s outer side (−1 left of the names, +1 right of the arcs\' words), its lanes 7 px apart and shared only where runs do not overlap (none overlap in one lane), outside the reach on its side and widening it by its lanes; with no wire the channel is nothing and the reaches are today\'s',
    gL.channel.side === -1 && gR.channel.side === 1 && gL.channel.lanes >= 1 && gL.channel.lanes === gR.channel.lanes && overlap(gL) === 0 && overlap(gR) === 0 && gL.channel.width === 16 + 7 * gL.channel.lanes
      && gL.channel.edge < -g0.leftReach && gR.channel.edge > g0.rightReach && gL.leftReach === g0.leftReach + gL.channel.width && gL.rightReach === g0.rightReach && gR.rightReach === g0.rightReach + gR.channel.width && gR.leftReach === g0.leftReach
      && g0.channel.width === 0 && g0.channel.lanes === 0 && withWires.wires.every((w, i) => { const x = gL.channel.edge - gL.channel.laneOf(i) * 7; return x < -g0.leftReach; }),
    { lanes: gL.channel.lanes, widthL: gL.channel.width, edgeL: gL.channel.edge, leftReach0: g0.leftReach, edgeR: gR.channel.edge, rightReach0: g0.rightReach });
  const html = unesc(renderToString(React.createElement('svg', null, React.createElement(InsideColumn, { inside: withWires, geometry: gL, idPrefix: 'w' }))));
  const at = (re) => { const m = re.exec(html); return m ? m.index : -1; };
  const wireCount = (html.match(/data-inside-wire="/g) || []).length; const groundCount = (html.match(/data-inside-ground="/g) || []).length;
  check('§7 ★★ THE DRAWING: the wiring group FIRST (under everything), one `data-inside-wire` per wire with its lane, its words and its two end squares, the denied ones dashed; then one opaque ground per name; then the arcs (after the grounds, so no way is hidden); no word on a wire; the same column without the second part draws no wire and the same arcs',
    wireCount === withWires.wires.length && groundCount === withWires.points.length && at(/data-inside-wiring=/) >= 0 && at(/data-inside-wiring=/) < at(/data-inside-grounds=/) && at(/data-inside-grounds=/) < at(/data-inside-arc=/)
      && (html.match(/data-inside-wire-end="from"/g) || []).length === withWires.wires.length && (html.match(/data-inside-wire-end="to"/g) || []).length === withWires.wires.length
      && (html.match(/data-inside-wire-denied="true"/g) || []).length === withWires.wires.filter((w) => !w.holds).length && (html.match(/stroke-dasharray="4 3"/g) || []).length >= withWires.wires.filter((w) => !w.holds).length
      && !/data-inside-wire-words="[^"]*"[^>]*>[\s\S]*?<text/.test(html.slice(at(/data-inside-wiring=/), at(/data-inside-grounds=/)))
      && (unesc(renderToString(React.createElement('svg', null, React.createElement(InsideColumn, { inside: without, geometry: g0, idPrefix: 'w0' })))).match(/data-inside-wire="/g) || []).length === 0
      && (unesc(renderToString(React.createElement('svg', null, React.createElement(InsideColumn, { inside: without, geometry: g0, idPrefix: 'w0' })))).match(/data-inside-arc="/g) || []).length === (html.match(/data-inside-arc="/g) || []).length,
    { wires: wireCount, grounds: groundCount, order: [at(/data-inside-wiring=/), at(/data-inside-grounds=/), at(/data-inside-arc=/)] });
  const ms = src('src/components/MidpointSurface.tsx');
  check('§7 ★★ THE EDGE\'S TWO COLUMNS carry their channels on their OUTER sides, by construction (A −1, B +1, a light +1) — the plane of ways untouched',
    /const optA = \{ \.\.\.opt, channelSide: -1 as const \}; const optB = \{ \.\.\.opt, channelSide: 1 as const \}; const optL = \{ \.\.\.opt, channelSide: 1 as const \};/.test(ms) && /insideGeometry\(insideA, optA\)/.test(ms) && /insideGeometry\(insideB, optB\)/.test(ms),
    'source pins');
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-DEPENDENCE-KIND: ALL PASS — read as structure, refused as a way at every act and field, two refusals at the load; the way-readers blind by construction; the count, the drawing and the card held' : `DIAGNOSE-THE-DEPENDENCE-KIND: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

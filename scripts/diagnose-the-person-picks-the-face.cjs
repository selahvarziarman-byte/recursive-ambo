#!/usr/bin/env node

// DIAGNOSTIC — THE PERSON PICKS THE FACE (engineer-chartered 2026-07-12;
// SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_PERSON_PICKS_THE_FACE.md`, SHA-256 c9af0a77…1a51; every
// pin below is the builder's own measurement).
//
// THE DEFECT THIS KILLS: the manuscript had no face selection —
// `operationContextFor` handed every op `shape.faces[0]`, a face the ENGINE
// picked by array order. On a multi-face form, `cut` removed a face the
// person never chose, and the boundary it leaves — a drawn mark — moved with
// the faces array: the same defect ef704d0 / 04a1c5f / c24585f were each
// spent killing, surviving in the one place the person's hand actually lands.
//
// THE RULE: a face-consuming op on a MULTI-face form requires a PICKED face;
// a SINGLE face is not a choice (that branch is byte-identical — the highest
// bar); `dual` and the sew ops are face-independent; the word ops and
// `collapse` are single-face gated. MEASURED and disclosed: `collapse-sphere`
// on a multi-face form was ALREADY unreachable (the single-face gate,
// ff52e41) — the array-order face never reached it; the defect's live
// person-facing surface was CUT alone. The rule still lands uniformly: every
// context carries the pick or nothing, and nothing defaults.
//
// THE FOUR CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — the picked cut's context carries THE PICKED
//     face (asserted ≠ faces[0] on a differing case), and the born child is
//     missing exactly the person's face.
//   2 CARRY THE MUTANT (the standing law: the witness outlives the commit) —
//     the faces[0]-default `operationContextFor` rides in-memory, VISIBLY
//     yields a different child per faces rotation (the picked door yields
//     ONE), and is byte-proven faithful to HEAD's committed function while
//     HEAD still carries it (§f — the one HEAD-aware branch).
//   3 SINGLE-FACE NON-MOVEMENT — the whole word-op zoo, invoked n-gons,
//     word-born children, chained births: BYTE-IDENTICAL through the new
//     context (a single face IS the context; no pick, no prompt, no change).
//   4 NO `.faces[0]` SURVIVES IN THE OP PATH — source-asserted (naming the
//     forbidden default inside a refusal string or comment is fine; the
//     access is not).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const {
  applyPlaygroundOperationTo,
  invokePrimitive,
  operationAvailabilityFor,
  operationContextFor,
} = req('src/manuscript/writtenFormModel.ts');
const { getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const torusOf = (prefix) => deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix)).shape;

// ---------------------------------------------------------------------------
// THE CARRIED WRONG MECHANISM — the faces[0]-default context, VERBATIM the
// shipped function (its fidelity to HEAD's committed operationContextFor is
// byte-proven in §f while HEAD still carries it):
function defaultFaceContextFor(shape, parentShape, ancestry) {
  const face = shape.faces[0] ?? null;
  return {
    form: shape,
    selectedFaceId: face ? face.id : null,
    selectedFace: face,
    parentShape,
    ...(ancestry ? { ancestry } : {}),
  };
}

console.log('the person picks the face: the last array-order default the person could touch is dead (blind concretes)\n');

// ═════ [a] cut on a 16-face torus: un-picked refuses; picked lands on THEIR face ═
console.log('----- [a] cut on the immersed torus: no pick ⇒ unavailable by name; picked ⇒ the boundary is where the person chose -----');
const T = torusOf('pfA');
check('the fixture is genuinely multi-face (16 faces) — faces[0] would be an array-order CHOICE here',
  T.faces.length === 16);
const unpicked = operationAvailabilityFor(T, null, undefined, null);
const cutUnpicked = unpicked.find((op) => op.id === 'cut');
check("no pick ⇒ `cut` is UNAVAILABLE with the committed NAMED reason ('Select a face to operate on.') — never silently enabled, never a silent faces[0]",
  cutUnpicked.enabled === false && cutUnpicked.reason === 'Select a face to operate on.');
const applyUnpicked = applyPlaygroundOperationTo('cut', T, null, 60, 8, undefined, null);
check('…and applying without a pick refuses with the same committed reason',
  applyUnpicked.ok === false && /Select a face/.test(applyUnpicked.reason));
const personsFace = T.faces[9]; // the person's pick — deliberately NOT faces[0]
const context = operationContextFor(T, null, undefined, personsFace.id);
check("CLAUSE 1 — EXECUTE WHAT YOU WITNESS: the context's selectedFaceId === the PICKED face, and it ≠ faces[0] (the differing case — a faces[0] resolution would not be a witness)",
  context.selectedFaceId === personsFace.id && personsFace.id !== T.faces[0].id && context.selectedFace === personsFace);
const cutPicked = applyPlaygroundOperationTo('cut', T, null, 61, 8, undefined, personsFace.id);
check('the picked cut SUCCEEDS and the born child is missing EXACTLY the person\'s face — the boundary is where they chose, not where the array began',
  cutPicked.ok === true &&
  cutPicked.born.shape.faces.length === 15 &&
  !cutPicked.born.shape.faces.some((face) => face.id === personsFace.id) &&
  cutPicked.born.shape.faces.some((face) => face.id === T.faces[0].id));
const availPicked = operationAvailabilityFor(T, null, undefined, personsFace.id);
check('availability with the pick: `cut` ENABLED (reason null); `dual` enabled with or without a pick (face-independent, unchanged)',
  availPicked.find((op) => op.id === 'cut').enabled === true &&
  availPicked.find((op) => op.id === 'dual').enabled === true &&
  unpicked.find((op) => op.id === 'dual').enabled === true);

// ═════ [b] collapse-sphere: the standing gate, measured and disclosed ═════════
// RE-CUT (engineer-chartered 2026-07-13, THE REFUSAL-ORDER LAW): the original
// leg pinned the face prompt FIRST un-picked — the very composite the law
// kills (no pick can cure the form-level gate, so prompting for one was a
// false promise). Both stages now name the honest gate.
console.log('\n----- [b] collapse-sphere on a multi-face form: gate-blocked at BOTH stages — the wall named before the door; never a default either way -----');
const collapseUnpicked = unpicked.find((op) => op.id === 'collapse-sphere');
const collapsePicked = availPicked.find((op) => op.id === 'collapse-sphere');
check('collapse-sphere on the 16-face torus is UNAVAILABLE both un-picked AND picked, and BOTH stages name the single-face COMPLEX gate (ff52e41) — the un-curable reason fires first; the array-order face never reached the op, and no path defaults',
  collapseUnpicked.enabled === false && /COMPLEX \(16 faces\)/.test(collapseUnpicked.reason) &&
  collapsePicked.enabled === false && /COMPLEX \(16 faces\)/.test(collapsePicked.reason));
note(`collapse reason at both stages (the honest gate): ${collapsePicked.reason.slice(0, 90)}…`);

// ═════ [t] THE REFUSAL-ORDER LAW (engineer-chartered 2026-07-13) ══════════════
// A refusal must name the reason that CANNOT be cured before the one that can:
// the FORM-level single-face gate (no pick changes it) fires BEFORE the
// selection-level face prompt. Order only — every string is the committed one.
console.log('\n----- [t] the refusal-order law: the wall named before the door — no futile prompt on the un-picked menu -----');
const GATED_OPS = ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius', 'collapse-sphere'];
note('the un-picked refusal table (16-face torus, NO pick made):');
for (const op of unpicked) {
  note(`  ${op.id.padEnd(24)} ${op.enabled ? 'ENABLED' : `disabled  "${op.reason.slice(0, 72)}${op.reason.length > 72 ? '…' : ''}"`}`);
}
check('every gated op (the five words + collapse-sphere) names the FORM-level gate with NO pick made — the un-curable wall, never the curable prompt',
  GATED_OPS.every((id) => {
    const op = unpicked.find((entry) => entry.id === id);
    return op.enabled === false && /COMPLEX \(16 faces\)/.test(op.reason);
  }));
check('…and the reroute is REACHABLE without any futile action: the gate message hands the person identify / the sew-boundary-* route, un-picked',
  GATED_OPS.every((id) =>
    unpicked.find((entry) => entry.id === id).reason.includes('Sew its boundary instead: use identify / the sew-boundary-* ops')));
const gtDirect = getPlaygroundOperation('glue-torus').getDisabledReason({ form: T, selectedFaceId: null, selectedFace: null });
check('at the REGISTRY seam itself (the reorder site): glue-torus un-picked answers the gate, not the face prompt',
  typeof gtDirect === 'string' && /COMPLEX \(16 faces\)/.test(gtDirect));
// THE INVARIANT, as a check and not a comment: an op may prompt for a face
// only where a pick can actually cure it.
const promptedOps = unpicked.filter((op) => op.reason === 'Select a face to operate on.');
const everyPromptCurable = promptedOps.every(({ id }) =>
  T.faces.some((face) =>
    operationAvailabilityFor(T, null, undefined, face.id).find((op) => op.id === id).enabled === true));
check('THE INVARIANT — no multi-face form is ever told to pick a face for an op a pick cannot enable: every face-prompted op becomes ENABLED under some pick (here exactly `cut`, whose prompt is true and curable)',
  promptedOps.length === 1 && promptedOps[0].id === 'cut' && everyPromptCurable);

// ═════ [c] CLAUSE 2's teeth — the faces[0] mutant moves; the picked door does not ═
console.log('\n----- [c] permute shape.faces (pure relabelling): the mutant births a different child per rotation; the picked door births ONE -----');
const rotatedFaces = (shape, k) => ({ ...shape, faces: [...shape.faces.slice(k), ...shape.faces.slice(0, k)] });
const cutOp = getPlaygroundOperation('cut');
const pickedIds = new Set();
const mutantIds = new Set();
for (const k of [0, 4, 9, 13]) {
  const rotated = rotatedFaces(torusOf('pfA'), k);
  const picked = applyPlaygroundOperationTo('cut', rotated, null, 62, 8, undefined, personsFace.id);
  pickedIds.add(picked.ok ? picked.born.shape.id : `refused:${picked.reason}`);
  const mutantContext = defaultFaceContextFor(rotated, null, undefined);
  mutantIds.add(cutOp.execute(mutantContext).id);
}
check('the PICKED door: ONE child identity across 4 rotations of the faces array (the person\'s face, wherever the array puts it)',
  pickedIds.size === 1);
check('★ THE TRAP\'S TEETH: the carried faces[0]-default context births FOUR DISTINCT children from the same 4 rotations — the cut landing wherever the array happens to begin (the defect, exhibited permanently)',
  mutantIds.size === 4);

// ═════ [d] CLAUSE 3 — single-face non-movement (the highest bar) ══════════════
console.log('\n----- [d] ★ single-face forms: a single face is NOT a choice — byte-identical through the new context -----');
const singleFaceZoo = [];
const sq = invokePrimitive('square', 70);
for (const opId of ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius', 'collapse-sphere', 'cut']) {
  const fresh = invokePrimitive('square', 70); // same seq ⇒ byte-identical fixture
  singleFaceZoo.push({ opId, target: fresh.shape, parent: null });
}
const chainedBase = applyPlaygroundOperationTo('glue-cylinder', sq.shape, null, 71, 8);
singleFaceZoo.push({ opId: 'glue-torus', target: chainedBase.born.shape, parent: sq.shape });
check('the whole single-face zoo — five words, collapse, cut, and the CHAINED word on a word-born quotient — runs BYTE-IDENTICALLY through the new context and the carried old default (one face IS the context; nothing to choose)',
  singleFaceZoo.every(({ opId, target, parent }) => {
    const op = getPlaygroundOperation(opId);
    const oldContext = defaultFaceContextFor(target, parent, parent ? [parent] : undefined);
    const newContext = operationContextFor(target, parent, parent ? [parent] : undefined);
    if (!eq(oldContext, newContext)) return false;
    if (!op.canApply(newContext)) return op.canApply(oldContext) === false; // both refuse identically
    return eq(op.execute(newContext), op.execute(oldContext));
  }));
check('…and the model boundary agrees: applyPlaygroundOperationTo on single-face forms needs NO pick and returns the identical born form with or without a (redundant) picked id',
  (() => {
    const a = applyPlaygroundOperationTo('glue-torus', invokePrimitive('square', 72).shape, null, 73, 8);
    const b = applyPlaygroundOperationTo('glue-torus', invokePrimitive('square', 72).shape, null, 73, 8, undefined, invokePrimitive('square', 72).shape.faces.map((f) => f.id)[0]);
    return a.ok && b.ok && eq(a.born, b.born);
  })());

// ═════ [e] the picker is REUSED and nothing is preselected ════════════════════
console.log('\n----- [e] Clause 4 + the picker: reused, nothing preselected, no .faces[0] in the op path -----');
const writtenSource = fs.readFileSync(path.join(repoRoot, 'src', 'manuscript', 'writtenFormModel.ts'), 'utf8');
const viewSource = fs.readFileSync(path.join(repoRoot, 'src', 'manuscript', 'ManuscriptView.tsx'), 'utf8');
const chromeSource = fs.readFileSync(path.join(repoRoot, 'src', 'manuscript', 'ManuscriptChrome.tsx'), 'utf8');
check('CLAUSE 4 — no `.faces[0]` access survives in the op path: writtenFormModel and ManuscriptView are clean (the single-face branch destructures its ONLY face; genesisModel was already clean at c24585f)',
  !/\.faces\[0\]/.test(writtenSource) && !/\.faces\[0\]/.test(viewSource) &&
  !/\.faces\[0\]/.test(fs.readFileSync(path.join(repoRoot, 'src', 'manuscript', 'genesisModel.ts'), 'utf8')));
check('the picker is REUSED, not duplicated: ManuscriptChrome defines exactly ONE PortFacePicker (exported), the combine gate panel renders it twice (port A + port B), and the view renders the SAME component for the op face',
  (chromeSource.match(/function PortFacePicker\(/g) ?? []).length === 1 &&
  /export function PortFacePicker\(/.test(chromeSource) &&
  (chromeSource.match(/<PortFacePicker/g) ?? []).length === 2 &&
  (viewSource.match(/<PortFacePicker/g) ?? []).length === 1);
check('⛔ NOTHING PRESELECTED: the op-face binding and both combine-port bindings fall back to the empty placeholder, the picker\'s first option IS the placeholder, and no code writes a faces[0] id into the pick state',
  /portFaces\[selected\] \?\? ''/.test(viewSource) &&
  (viewSource.match(/\.id \?\? ''/g) ?? []).length >= 2 &&
  /— pick the port face —/.test(chromeSource) &&
  !/setPortFaces\([^)]*faces\[0\]/.test(viewSource));

// ═════ [f] the carried mutant is FAITHFUL (HEAD-state-aware; both branches real) ═
console.log('\n----- [f] fidelity: the carried faces[0] default IS the committed function (checkable only pre-commit; done now) -----');
const headWrittenSource = execSync('git show HEAD:src/manuscript/writtenFormModel.ts', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const headHasDefault = !headWrittenSource.includes('THE PERSON PICKS THE FACE');
if (headHasDefault) {
  const fake = path.join(repoRoot, 'src', 'manuscript', 'writtenFormModel.__head__.ts');
  const m = new Module(fake, module);
  m.filename = fake;
  m.paths = Module._nodeModulePaths(path.dirname(fake));
  m._compile(ts.transpileModule(headWrittenSource, { ...TRANSPILE_OPTIONS, fileName: fake }).outputText, fake);
  const headModel = m.exports;
  const fixtures = [
    { shape: torusOf('pfA'), parent: null },
    { shape: invokePrimitive('square', 74).shape, parent: null },
    { shape: chainedBase.born.shape, parent: sq.shape },
    { shape: cutPicked.born.shape, parent: T },
  ];
  check('PRE-COMMIT FIDELITY: the carried mutant ≡ HEAD\'s committed operationContextFor, byte-for-byte, on multi-face, single-face, quotient, and cut-born fixtures — the mutant is the real old mechanism, not a strawman',
    fixtures.every(({ shape, parent }) =>
      eq(defaultFaceContextFor(shape, parent, parent ? [parent] : undefined), headModel.operationContextFor(shape, parent, parent ? [parent] : undefined))));
  note('HEAD carries the faces[0] default — the fidelity byte-compare ran LIVE (this branch retires with the commit; the mutant is then already proven)');
} else {
  check('POST-COMMIT: HEAD carries the picked-face context (the marker present; the pickedFaceId parameter in place); the carried mutant\'s fidelity was byte-proven pre-commit while HEAD still had the default — and its wrongness stays visible above (§c: four children from four rotations)',
    headWrittenSource.includes('THE PERSON PICKS THE FACE') && headWrittenSource.includes('pickedFaceId'));
  note('HEAD carries the picked-face context — the pre-commit fidelity branch has retired on its own detection, as designed');
}

// ═════ [g] guards ═════════════════════════════════════════════════════════════
console.log('\n----- [g] no-regression: the pick is manuscript-layer; the registry and the engine are frozen -----');
// THE ENGINE FREEZE MANIFEST (engineer-chartered 2026-07-12): the old
// per-diagnostic HEAD-differential guard REQUIRED A HOLE IN ITSELF to permit
// any sanctioned change (a carve-out — silent, and permanent unless a human
// remembered; `playgroundOperations.ts` left this very guard mid-build and
// ended up guarded by NOBODY). The engine is now frozen by ONE on-repo
// manifest of content hashes (docs/governance/ENGINE_FREEZE_MANIFEST.txt):
// a sanctioned change is a one-line hash update in the SAME commit, and
// coverage never lapses. The shared checker READS the manifest and can never
// write it. (§f's `git show HEAD:` read above is a DIFFERENT mechanism — the
// carried faces[0] mutant's HEAD-state-aware fidelity — and stays.)
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
// 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports — a
// frozen file is only as frozen as its dependencies; src/types joined the scan.
check('THE ENGINE FREEZE MANIFEST: all 45 frozen engine files (import-closed) match their manifest hashes and every source file under the engine roots is classified — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 46 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
if (!freeze.ok) note(`drifted: [${freeze.drifted}] · missing: [${freeze.missing}] · unlisted: [${freeze.unlisted}]`);
// THE FREEZE CHECK STILL BITES (stub-proof — a checker that cannot fail is dead):
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

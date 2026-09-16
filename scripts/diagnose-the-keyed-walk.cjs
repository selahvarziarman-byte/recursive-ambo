#!/usr/bin/env node

// DIAGNOSTIC — THE KEYBOARD WALK (STAMP K-1 + STAMP K-2a §5, Arman verbatim through the
// mothership 2026-09-10 15:40: *"no i myself want the keyboard control in… a
// pocket implementation for this one issue only"*).
//
// THE ACT: press a door's own LETTER to cross it; shift crosses it backwards,
// because the app already writes an inverse as a CAPITAL. The doors were
// already named — B-2 gave every portal face its `door: {pair, side}` and the
// trace its letter — so the pocket binds a key to a name that exists, and
// mints no vocabulary of its own. `KeyboardEvent.key` IS the trace letter.
//
// ⛔ THE LAW THIS WITNESS HOLDS — LAW 22, ONE PRODUCER OF MOTION: a keyed
// crossing and a pointer crossing ride the SAME integrator and the SAME
// transport, so the record cannot tell which instrument performed a crossing.
// That is pinned two ways here: the letter/geometry producers are RUN (they
// can return the wrong door, the wrong span, or refuse a letter they should
// take), and the view is SOURCE-PINNED for the absence of a second motion
// path and of any instrument tag in the seam or the trace.

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

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { doorLetter, faceForLetter, crossingSpan, letterForKey } = req('src/manuscript/orderTrace.ts');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};

console.log('THE KEYBOARD WALK — a key addresses a door by the name the door already has (STAMP K-1)\n');

// the T³ room's own shape: three pairings, six faces, the cube's half-width as
// every plane's offset — the acceptance's control room, in fixture form
const wall = (n, d) => ({ n, d, wall: true });
const door = (n, d, pair, side) => ({ n, d, wall: false, door: { pair, side } });
const T3 = [
  door([1, 0, 0], 1, 0, 'a'),
  door([-1, 0, 0], 1, 0, 'b'),
  door([0, 1, 0], 1, 1, 'a'),
  door([0, -1, 0], 1, 1, 'b'),
  door([0, 0, 1], 1, 2, 'a'),
  door([0, 0, -1], 1, 2, 'b'),
];

console.log('----- §1 the key IS the letter: one spelling for what the trace writes and what a press addresses -----');
check("§1 the letter producer: side 'a' spells lowercase in the room's own pair order (a · b · c …) and the INVERSE side spells the capital (A · B · C …)",
  [0, 1, 2, 3, 4, 5].every((k) => doorLetter({ pair: k, side: 'a' }) === 'abcdef'[k] && doorLetter({ pair: k, side: 'b' }) === 'ABCDEF'[k]));
check("§1 ★ a typed letter addresses that door and no other: 'a' → the +x face (side a of pair 0) · 'A' → the −x face (side b — the inverse, which is what shift already types and what the trace already writes) · 'b'/'B' → pair 1 · 'c'/'C' → pair 2",
  faceForLetter(T3, 'a') === 0 && faceForLetter(T3, 'A') === 1 &&
    faceForLetter(T3, 'b') === 2 && faceForLetter(T3, 'B') === 3 &&
    faceForLetter(T3, 'c') === 4 && faceForLetter(T3, 'C') === 5,
  JSON.stringify(['a', 'A', 'b', 'B', 'c', 'C'].map((k) => faceForLetter(T3, k))));
check("§1 AN UNBOUND KEY DOES NOTHING AND MINTS NOTHING: a letter this room has no door for ('d' … 'f', 'z') addresses nothing, and neither does a key that is not a letter at all ('Escape' keeps its meaning, 'Shift', 'Enter', ' ')",
  ['d', 'e', 'f', 'z', 'D', 'Z'].every((k) => faceForLetter(T3, k) === -1) &&
    ['Escape', 'Shift', 'Enter', 'ArrowUp', ' ', ''].every((k) => faceForLetter(T3, k) === -1));
check("§1 ★ SHIFT MEANS THE INVERSE SIDE, stated once: the letter a keystroke types is the key, capitalised when shift is held — so 'a'+shift addresses the inverse door whether the platform spells the event 'A' (a hand on a real keyboard) or 'a' with shiftKey (measured: the in-app browser's own key injection). Without shift the key rides through untouched",
  letterForKey('a', true) === 'A' && letterForKey('A', true) === 'A' && letterForKey('a', false) === 'a' &&
    letterForKey('A', false) === 'A' && letterForKey('Escape', false) === 'Escape');
check('§1 …and the two spellings of an inverse press land on the SAME face — the door does not depend on the instrument',
  faceForLetter(T3, letterForKey('a', true)) === faceForLetter(T3, letterForKey('A', true)) &&
    faceForLetter(T3, letterForKey('a', true)) === 1);
check('§1 a room with SIX pairings (a … f — Seifert–Weber, the other acceptance room) answers every one of the twelve letters, each to its own face',
  (() => {
    const sw = [];
    for (let pair = 0; pair < 6; pair += 1) {
      sw.push(door([Math.cos(pair), Math.sin(pair), 0], 1, pair, 'a'));
      sw.push(door([-Math.cos(pair), -Math.sin(pair), 0], 1, pair, 'b'));
    }
    const seen = 'abcdefABCDEF'.split('').map((k) => faceForLetter(sw, k));
    return seen.every((i) => i >= 0) && new Set(seen).size === 12;
  })());
check('§1 a WALL is not a door and carries no letter — the vocabulary is the doors\', and a room of walls answers nothing',
  faceForLetter([wall([1, 0, 0], 1), wall([0, 1, 0], 1)], 'a') === -1);

console.log('\n----- §2 the crossing is a WALK of the room\'s own width, never a jump to the plane -----');
check('§2 ★ the span across a pairing is the distance between the door\'s plane and its PARTNER\'s (the offsets add — the two normals are reversed): the T³ fixture reads 2 across every pairing, which is the cell width a leg of one lattice period covers',
  [0, 1, 2, 3, 4, 5].every((i) => crossingSpan(T3, i) === 2), JSON.stringify([0, 1, 2, 3, 4, 5].map((i) => crossingSpan(T3, i))));
check('§2 an OFF-CENTRE room is read from its two planes, never from one doubled: a door at 1 whose partner sits at 3 spans 4 (both sides agree — the span is the pairing\'s, not the face\'s)',
  (() => {
    const off = [door([1, 0, 0], 1, 0, 'a'), door([-1, 0, 0], 3, 0, 'b')];
    return crossingSpan(off, 0) === 4 && crossingSpan(off, 1) === 4;
  })());
check('§2 a door whose partner the room does not record falls back to twice its own offset — never 0, because a keyed crossing that could not move would mint a keystroke with no act',
  crossingSpan([door([1, 0, 0], 1.5, 0, 'a')], 0) === 3);
check('§2 LAW 24 — the span can be wrong: a fixture whose partner plane sits at 5 must NOT read 2 (the T³ answer), and does not',
  crossingSpan([door([1, 0, 0], 1, 0, 'a'), door([-1, 0, 0], 5, 0, 'b')], 0) === 6);

console.log('\n----- §3 ★★ ONE PRODUCER OF MOTION (LAW 22) — source-pinned in the view -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
const advances = viewSrc.match(/eye = \[eye\[0\] \+ /g) ?? [];
check('§3 ★★ THE EYE IS MOVED IN EXACTLY ONE PLACE outside the transport: `advanceBy` — one integrator, whoever asked. A keyed crossing hands it a direction and a bound; it does not move the eye itself',
  advances.length === 1 && viewSrc.includes('const advanceBy = (ms: number, dir: Vec3 = camF, maxChart = Infinity): number =>'),
  `motion sites outside the transport: ${advances.length}`);
check('§3 ★★ THE KEYED WALK RIDES THE FRAME\'S OWN TWO CALLS: it advances through `advanceBy` and is carried by the same `transportWalk(beforeAdvance)` the pointer walk uses — there is no transport call inside the key handler and none anywhere but the frame and the pointer-up',
  viewSrc.includes('keyedLeft -= advanceBy(now - keyedClock, keyedDir, keyedLeft);') &&
    (viewSrc.match(/transportWalk\(/g) ?? []).length === 2, // the frame and the pointer-up; no third caller
  `transportWalk call sites: ${(viewSrc.match(/transportWalk\(/g) ?? []).length}`);
const keyHandler = viewSrc.slice(viewSrc.indexOf('const onKey = (ev: KeyboardEvent)'), viewSrc.indexOf('const onDown = (ev: PointerEvent)'));
check('§3 ★★ THE KEY HANDLER PERFORMS NO MOTION AND NO CROSSING: its body assigns no eye, calls no transport, and writes no trace letter — it sets a direction, a distance and the walk\'s clock, and nothing else',
  keyHandler.length > 0 && !/\beye\s*=/.test(keyHandler) && !keyHandler.includes('transportWalk') &&
    !keyHandler.includes('seam.trace') && !keyHandler.includes('seam.doors') && !keyHandler.includes('refreshOrderSurface'));
check('§3 ★★ NO INSTRUMENT TAG EXISTS TO LEAVE: the seam type and the walk carry no `keyed`/`instrument`/`bySource` field, and the trace is written at exactly the two crossing sites in the transport — a keyed word and a walked word are one record',
  !/seam\.(keyed|instrument|inputSource|bySource|byKeyboard|viaKey)/.test(viewSrc) &&
    !/^\s*(keyed|instrument|inputSource|bySource|byKeyboard|viaKey)[?]?:/m.test(viewSrc) &&
    (viewSrc.match(/seam\.trace \+= doorLetter\(/g) ?? []).length === 2,
  `trace-write sites: ${(viewSrc.match(/seam\.trace \+= doorLetter\(/g) ?? []).length}`);
check('§3 the letter is not re-spelled in the view: `doorLetter` is IMPORTED from the one producer and the old local mint is gone, so a key can never address a door by a spelling the trace does not write',
  /import \{[\s\S]*?doorLetter,[\s\S]*?\} from '\.\/orderTrace';/.test(viewSrc) &&
    !viewSrc.includes("const doorLetter = (door: { pair: number; side: 'a' | 'b' }): string =>"));
check('§3 the guards stand: the browser\'s own chords pass through, an auto-repeat is not a second press, a focused text field keeps its keys, and a walk in flight is never queued behind',
  keyHandler.includes('ev.ctrlKey || ev.altKey || ev.metaKey || ev.repeat') &&
    keyHandler.includes('faceForLetter(cellSurface.faces, letterForKey(ev.key, ev.shiftKey))') &&
    keyHandler.includes("el.tagName === 'INPUT'") && keyHandler.includes('if (keyedDir || advancing || keyWalk !== 0) return;'));
check('§3 the hand takes the wheel: engaging the pointer\'s hold drops a keyed crossing in flight rather than integrating two directions at once',
  viewSrc.includes("keyedDir = null; // K-1: the hand took the wheel"));
check('§3 ★ ONE PRESS IS ONE CROSSING: once the named door is behind the eye the remaining width is clamped SHORT of the next door\'s plane, read off the SAME plane test the transport reads — the width is a budget, never a licence to fall through a second door',
  viewSrc.includes('if (keyedCrossed) {') && viewSrc.includes('keyedLeft = Math.min(keyedLeft, Math.max(0, ahead - 1e-3));') &&
    viewSrc.includes('if (keyedDir && seam.doors > doorsBeforeTransport) keyedCrossed = true;'));
check('§3 ★ THE MEASURED STOP: a SEALED CURVED room refuses the letter — the handler returns on the room\'s own carried geometry mark (`cellSurface.model`, never re-inferred) BEFORE it resolves a door, so nothing is minted where the chart width is not the true width',
  /if \(cellSurface\.model\) return;\r?\n\s*const at = faceForLetter\(/.test(viewSrc));
check('§3 …and the heading is CARRIED through a door like the frame, in both door kinds (projective and affine) — a walk that kept an untransported direction re-crossed one pair over and over',
  viewSrc.includes('if (keyedDir) keyedDir = nrm3(push(keyedDir));') &&
    viewSrc.includes('if (keyedDir) keyedDir = nrm3(applyRot(g, keyedDir));'));

console.log('\n----- §4 the gesture is STATED where the panel already states its gestures -----');
check('§4 the walk panel\'s own line names the letter act and keeps the pointer\'s acts beside it (K-2a rewrote the line as the keyboard\'s — §5 pins it whole; a gesture the app states nowhere is a design failure)',
  /a door's letter — cross it, shift for the other way · drag — look around · press and hold — walk forward/.test(
    viewSrc.replace(/\s+/g, ' '),
  ));

console.log('\n----- §5 ★★ STAMP K-2a — THE COMPLETE KEYBOARD WALK: everything the pointer does, by keys, on the SAME producers -----');
const { walkKeyAct, WALK_KEYS } = req('src/manuscript/orderTrace.ts');
check('§5 ★ THE BINDING TABLE, RUN: ↑ walks forward · ↓ back · ← turns left · → right · PgUp looks up · PgDn down — six acts, six keys, stated once in orderTrace',
  walkKeyAct('ArrowUp') === 'forward' && walkKeyAct('ArrowDown') === 'back' && walkKeyAct('ArrowLeft') === 'left' &&
    walkKeyAct('ArrowRight') === 'right' && walkKeyAct('PageUp') === 'up' && walkKeyAct('PageDown') === 'down' && WALK_KEYS.length === 6);
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -=[];\',./`'.split('');
check('§5 ★★ THE ALPHABET IS THE DOORS\' — BY CONSTRUCTION: every single-character key (all 52 letters, the digits, the symbols) is refused as a walk key before the table is read, so no room of up to 26 pairings can ever have a door and a walk act on one key. W/A/S/D in particular: `a` is door 0 in EVERY room and `d`/`e` are doors in a six-pairing room — measured, and why the mandate\'s second spelling is not bound',
  alphabet.every((k) => walkKeyAct(k) === null) && ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'q', 'e'].every((k) => walkKeyAct(k) === null));
check('§5 …and the doors keep their letters untouched: `a` still addresses face 0 of the T³ fixture and shift still means the inverse (K-1 as landed)',
  faceForLetter(T3, letterForKey('a', false)) === 0 && faceForLetter(T3, letterForKey('a', true)) === 1);
check('§5 LAW 24 — the table can refuse: Escape, Shift, Enter, Space, Tab, Home, End and the unbound function keys walk nothing (esc keeps its meaning)',
  ['Escape', 'Shift', 'Enter', ' ', 'Tab', 'Home', 'End', 'F5', 'Control', 'Alt', 'Meta', ''].every((k) => walkKeyAct(k) === null));
check('§5 ★★ STILL ONE MOTION SITE: the held walk added no eye assignment — `advanceBy` is the only place outside the transport that moves the eye, for the pointer\'s hold, the held key AND the letter alike',
  (viewSrc.match(/eye = \[eye\[0\] \+ /g) ?? []).length === 1);
check('§5 ★★ THE HELD KEY IS THE POINTER\'S HOLD: the frame integrates it through the same call on the same clock law — forward hands `camF`, BACK hands the SAME call the negated direction (never a second path) — and the pointer\'s own line is byte-unchanged',
  viewSrc.includes('advanceBy(now - keyWalkClock, keyWalk > 0 ? camF : neg3(camF));') &&
    viewSrc.includes('keyWalkClock = Math.max(keyWalkClock, now);') &&
    /        advanceBy\(now - advClock\);\r?\n        advClock = Math\.max\(advClock, now\);/.test(viewSrc));
check('§5 ★★ ONE CLOSE FOR BOTH INSTRUMENTS: the pointer\'s up and a key\'s up end a walk through the same `closeWalk` (the integral to the release\'s TRUE time, then the transport) — `transportWalk` has exactly two callers: the frame and that close',
  viewSrc.includes('closeWalk(advClock, ev.timeStamp);') &&
    viewSrc.includes('if (keyWalk !== 0) closeWalk(keyWalkClock, at, keyWalk > 0 ? camF : neg3(camF));') &&
    (viewSrc.match(/transportWalk\(/g) ?? []).length === 2,
  `transportWalk call sites: ${(viewSrc.match(/transportWalk\(/g) ?? []).length}`);
check("§5 ★★ ONE FRAME WRITER (LAW 22): the drag and the held turn key both rotate the carried frame through `rotateFrame`, and it rotates WITHIN the frame's own planes (yaw in F–R, pitch in F–U) — exact in every metric because the frame is orthonormal in the room's own metric; no Rodrigues axis and no chart renormalisation remain in the view (measured 2026-09-16: after a projective door the old axis-rotation turned a π drag 119° and a π key-hold 120°, 11.8° apart)",
  viewSrc.includes('const rotateFrame = (yaw: number, pitch: number): void => {') &&
    viewSrc.includes('const f1: Vec3 = [camF[0] * cy + camR[0] * sy, camF[1] * cy + camR[1] * sy, camF[2] * cy + camR[2] * sy];') &&
    viewSrc.includes('const u2: Vec3 = [camU[0] * cp + camF[0] * sp, camU[1] * cp + camF[1] * sp, camU[2] * cp + camF[2] * sp];') &&
    !/rot3\(/.test(viewSrc) && !/nrm3\(rot3\(/.test(viewSrc) &&
    viewSrc.includes('rotateFrame(-dxPx * s, -dyPx * s);'));
check('§5 ★ THE SIGN IS MEASURED: left and up are the NEGATIVE angles at the writer (a +90° yaw was sighted turning the view RIGHT, a +90° pitch looking DOWN), applied at both spends — the frame\'s sweep and the release\'s close',
  (viewSrc.match(/rotateFrame\(-keyYaw \* KEY_TURN_RATE \* dt, -keyPitch \* KEY_TURN_RATE \* dt\);/g) ?? []).length === 2 &&
    viewSrc.includes('const KEY_TURN_RATE = Math.PI / 2;'));
check('§5 a RELEASE ends the walk as the pointer\'s does: keyup is listened for and removed with keydown; and losing focus RELEASES every held key (a key let go while the window has no focus never sends its keyup) — the pointer\'s hold taking the wheel releases them at the hold\'s true time too',
  viewSrc.includes("window.addEventListener('keyup', onKeyUp);") && viewSrc.includes("window.removeEventListener('keyup', onKeyUp);") &&
    viewSrc.includes("window.addEventListener('blur', onBlur);") && viewSrc.includes("window.removeEventListener('blur', onBlur);") &&
    viewSrc.includes('releaseKeys(downT + ADVANCE_HOLD_MS);'));
const keyHandler5 = viewSrc.slice(viewSrc.indexOf('const onKey = (ev: KeyboardEvent)'), viewSrc.indexOf('const onKeyUp = (ev: KeyboardEvent)'));
check('§5 the key handler still moves nothing itself: a bound key records a held act and hands the two resolvers its time — no eye assignment, no transport, no trace write in the handler; the walk keys are read BEFORE the letters and never as a letter',
  keyHandler5.length > 0 && !/\beye\s*=/.test(keyHandler5) && !keyHandler5.includes('transportWalk') && !keyHandler5.includes('seam.trace') &&
    keyHandler5.indexOf('const act = walkKeyAct(ev.key);') < keyHandler5.indexOf('faceForLetter(cellSurface.faces') &&
    keyHandler5.includes('if (keyedDir || advancing || keyWalk !== 0) return;'));
check('§5 NO INSTRUMENT TAG, still: the seam carries no keyed/instrument field and the trace is written at the two crossing sites only',
  !/seam\.(keyed|instrument|inputSource|bySource|byKeyboard|viaKey|heldKey)/.test(viewSrc) &&
    (viewSrc.match(/seam\.trace \+= doorLetter\(/g) ?? []).length === 2);
const flat = viewSrc.replace(/\s+/g, ' ');
check('§5 ★ THE LINE IS TRUE AND COMPLETE, per room: in a flat room every bound key is named with its act and the letters offered; in a sealed curved room the SAME line says the door letters REST and the walk keys do not — the line is keyed on the room\'s own carried mark',
  /\{cellSurface\.model \? '↑\/↓ — walk forward and back · ←\/→ — turn · PgUp\/PgDn — look up and down · the door letters rest in this curved room, the walk keys do not · drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell' : "↑\/↓ — walk forward and back · ←\/→ — turn · PgUp\/PgDn — look up and down · a door's letter — cross it, shift for the other way · drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell"\}/.test(flat));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-KEYED-WALK: ALL PASS — the key addresses a door by its own name, the held keys walk and turn on the pointer\'s own producers, and one producer moves the eye' : `DIAGNOSE-THE-KEYED-WALK: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

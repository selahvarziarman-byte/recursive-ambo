#!/usr/bin/env node
// THE CHILD'S CAST — the mock's data (the designer, 2026-10-10; turned from squares to LOOPS on ADR 0031 §9.40 + §9.41, ratified at
// claims §350). Reads a workspace file directly (read-only) and writes data.js for index.html:
// - the child's roles (its '+' relatings, in the edge's order) with their qualities by corner;
// - this edge's words, each with the way it reads (from X's role, or from Y's);
// - every CLOSED loop between two roles i < j (column order): X's say between x_i and x_j (a recorded relation with its direction and
//   sign, or the sameness where x_i = x_j), line j, Y's say between y_j and y_i, line i. One loop per pair of says. A loop is OPEN when
//   either parent is silent: nothing, never written here. A loop with a refused side is FORM (§9.41 (2)): written, flagged, never offered.
// - per loop, its shape key read along the walk from i (the parents' words with their directions and signs), and with the modes too.
// Usage: node extract-culture.cjs <record.workspace.json> <A> <B> > data.js
const fs = require('node:fs');
const [file, A, B] = process.argv.slice(2);
const save = JSON.parse(fs.readFileSync(file, 'utf8')); const shape = save.shapes[save.currentShapeId]; const V = shape.vertices;
const cornerOf = (lab) => Object.values(V).find((v) => v.data?.label === lab && v.data?.cast)?.id;
const a = cornerOf(A), b = cornerOf(B);
const e = shape.edges.find((x) => (x.vertexIds[0] === a && x.vertexIds[1] === b) || (x.vertexIds[0] === b && x.vertexIds[1] === a));
const X = e.vertexIds[0], Y = e.vertexIds[1]; const CX = V[X].data.cast, CY = V[Y].data.cast; const LX = V[X].data.label, LY = V[Y].data.label;
// the concept between: the midpoint born of this edge; its name only where he gave one (custom.christened), else a true absence
const mid = Object.values(V).find((v) => { const s = v.data?.lineage?.sources ?? []; return s.some((x) => x.id === X) && s.some((x) => x.id === Y) && v.data?.lineage?.inheritanceMode === 'derived-from-edge'; });
const concept = mid?.data?.custom?.christened ? mid.data.label : null;
const lbl = (C, id) => C.roles.find((r) => r.id === id)?.label ?? id;
const rels = e.data?.relatings || [];
// this edge's words, each with the way it reads (a relating's 5th field '←' reads from Y's role)
const words = [...new Set(rels.map((r) => r[0]))].map((w) => ({ w, fromY: rels.some((r) => r[0] === w && r[4] === '←') }));
const roles = rels.filter((r) => r[3] === '+').map((r, k) => {
  const x = r[1], y = r[2], dir = r[4] || '→';
  const sentence = dir === '←' ? `${lbl(CY, y)} ${r[0]} ${lbl(CX, x)}` : `${lbl(CX, x)} ${r[0]} ${lbl(CY, y)}`;
  const q = (C, L, id) => Object.entries(C.roles.find((s) => s.id === id)?.types ?? {}).map(([name, value]) => ({ corner: L, name, value }));
  return { k, w: r[0], x, y, xl: lbl(CX, x), yl: lbl(CY, y), dir, sentence, qualities: [...q(CX, LX, x), ...q(CY, LY, y)] };
});
// a parent's says between p (i's end) and q (j's end): 'same' where p = q, else its recorded relations (fwd: runs from i's end); [] = silent
const saysOf = (C, p, q) => (p === q ? ['same'] : (C.relations || []).filter((r) => (r.terms || []).length === 2 && ((r.terms[0] === p && r.terms[1] === q) || (r.terms[0] === q && r.terms[1] === p)))
  .map((r) => ({ w: r.type, fwd: r.terms[0] === p, pos: r.polarity !== 'does-not-hold', from: lbl(C, r.terms[0]), to: lbl(C, r.terms[1]) }))
  .filter((r, k, all) => all.findIndex((s) => s.w === r.w && s.fwd === r.fwd && s.pos === r.pos) === k));
const part = (s) => (s === 'same' ? '=' : `${s.pos ? '' : 'not '}${s.w}${s.fwd ? '→' : '←'}`);
const loops = []; const pairs = { fillable: { four: 0, three: 0, two: 0 }, refusalOnly: { four: 0, three: 0 }, open: 0, nothing: 0 };
for (let i = 0; i < roles.length; i++) for (let j = i + 1; j < roles.length; j++) {
  const ri = roles[i], rj = roles[j]; const xs = saysOf(CX, ri.x, rj.x), ys = saysOf(CY, ri.y, rj.y);
  if (!xs.length && !ys.length) { pairs.nothing += 1; continue; }
  if (!xs.length || !ys.length) { pairs.open += 1; continue; } // one parent silent: an open loop is nothing
  const kind = xs[0] === 'same' && ys[0] === 'same' ? 'two' : xs[0] === 'same' ? 'three-x' : ys[0] === 'same' ? 'three-y' : 'four';
  let anyOpen = false;
  for (const sx of xs) for (const sy of ys) {
    const refused = (sx !== 'same' && !sx.pos) || (sy !== 'same' && !sy.pos); if (!refused) anyOpen = true;
    const key = JSON.stringify([part(sx), part(sy)]); const keyModes = JSON.stringify([part(sx), part(sy), ri.w, rj.w]);
    loops.push({ id: loops.length, i, j, kind, X: sx, Y: sy, refused, key, keyModes });
  }
  const k3 = kind.startsWith('three') ? 'three' : kind;
  if (anyOpen) pairs.fillable[k3] += 1; else pairs.refusalOnly[k3] = (pairs.refusalOnly[k3] || 0) + 1;
}
// for the pairing tab (Arman 10:31): each parent's roles with their glosses, every relating at this edge (holds or a bar), his lexicon
const parentRoles = (C) => C.roles.map((r) => ({ id: r.id, label: r.label, gloss: r.marks?.gloss ?? '' }));
const relatings = rels.map((r) => ({ w: r[0], x: r[1], y: r[2], holds: r[3] === '+', fromY: r[4] === '←' }));
const lexicon = (save.lexicon ?? []).map((w) => ({ w, fromY: words.find((x) => x.w === w)?.fromY ?? null }));
const data = { file: file.split(/[\\/]/).pop(), X: LX, Y: LY, concept, words, roles, loops, pairs, parents: { X: parentRoles(CX), Y: parentRoles(CY) }, relatings, lexicon };
const open = loops.filter((l) => !l.refused); const shapes = new Map(), shapesM = new Map();
for (const l of open) { shapes.set(l.key, (shapes.get(l.key) || 0) + 1); shapesM.set(l.keyModes, (shapesM.get(l.keyModes) || 0) + 1); }
process.stderr.write(`${LX}–${LY}: ${roles.length} roles · pairs ${JSON.stringify(pairs)} · ${loops.length} closed loops (${open.length} that can be filled, ${loops.length - open.length} across a refusal) · loop shapes ${shapes.size} (most ${Math.max(...shapes.values())} loops), with the modes ${shapesM.size} (most ${Math.max(...shapesM.values())}) · words ${JSON.stringify(words)}\n`);
process.stdout.write(`// generated by extract-culture.cjs from ${data.file} — read-only; the mock's data (loops, ADR 0031 §9.40–§9.41)\nwindow.CHILD = ${JSON.stringify(data)};\n`);

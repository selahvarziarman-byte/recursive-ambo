#!/usr/bin/env node

// DIAGNOSTIC — the DIFFERENTIAL ORACLE: the witness `identifyOnComplex` has
// never had (mothership-chartered TOP ITEM; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_DIFFERENTIAL_ORACLE.md`, SHA-256 8da7daab…e8d839; every pin
// below is the builder's own measured concrete).
//
// THE HOLE THIS CLOSES: identify()'s single-face path DELEGATES to the
// committed word machinery BY CONSTRUCTION (via: 'committed-word'), so the
// five-word byte-compare witnessed the ADAPTER — never the general enactment.
// `identifyOnComplex` — the machine that runs every multi-face sew and the
// whole depth-4 generative closure — has had NO independent implementation
// check. This diagnostic builds one.
//
// THE ORACLE (§0): an independently written reference quotient — signed
// union-find + explicit signed-class rewrite — DERIVED FROM THE SPEC
// (docs/adr/0021 §§3–5, grounded by §6's measured outcomes), never from the
// enactment's code. Where the spec is silent (the direction reference of an
// INTERIOR edge), the oracle REFUSES to guess: the ambiguity is flagged for
// the researcher and the affected compare legs are restricted — never
// resolved by reading `identifyOnComplex`.
//
// THE TWO SEAL CLAUSES, held:
//   CLAUSE 1 — EXECUTE WHAT YOU WITNESS: every oracle-checked case asserts
//     `via === 'general'` (the enactment actually ran). §w demonstrates the
//     clause's teeth: a square identify reads via 'committed-word' and is
//     asserted NOT to qualify as a witness.
//   CLAUSE 2 — TRAP-SENSITIVITY, PLURALLY: §m mutates `identifyOnComplex`
//     IN MEMORY (never on disk) five distinct ways — endpoint-keyed classes ·
//     flipped mode convention · path-2 no-merge · unrewritten face cycles ·
//     mis-seeded ledger — and the oracle must VISIBLY catch each, on a case
//     that exercises the defect, else the oracle is VOID.
//
// THE AGREEMENT BATTERY (each `via === 'general'`, byte-STRUCTURE compared —
// vertex classes, signed edge classes, face cycles, ledger membership, born
// shape cycles; the spec pins no minted-id FORMATS, so identity is compared
// structurally through positional bijections):
//   §a cylinder rims, BOTH modes (torus w₁=0 / Klein w₁=1) — and the ORACLE'S
//      OWN complex certifies to those externally-derived truths through the
//      committed certifier, with no enactment in the loop (§5 grounding).
//   §b the trap-sensitive parallel-class rep (the height-1 tube — its sewn
//      torus carries PARALLEL seam classes, the route-B condition).
//   §c interior identification — the merged 4-wedge class, the gate refusal;
//      compare restricted to the direction-free structure (the flagged spec
//      ambiguity), disclosed.
//   §d a genuine multi-face complex at scale (the 8×1 tube whose canonical
//      sew lands the n/2 seam — an 8-long parallel-class seam).
//   §e THE DEPTH-4 CHAIN (tube → sew → cut → cut → re-sew), the oracle
//      maintaining ITS OWN complex through every generation and cross-checked
//      at each — ending at the mothership's hand-derived pair: genus-2
//      (preserving) and N₄ (reversing), certified on the ORACLE'S own output.
//
// ⛔ A DISAGREEMENT IS A FINDING (§6 of the mandate): this script never edits
// the oracle to match — a mismatch prints both readings and FAILS.
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

const { identify, sewBoundaryCircles, walkBoundaryCircles, acquireComplex } = req('src/lib/complexIdentification.ts');
const { acquireFaithfulComplex, classifyComplexComponent, classLabel } = req('src/manuscript/surfaceClassifier.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;
const setKey = (members) => [...members].sort((a, b) => a.localeCompare(b)).join('~');

// ═════════════════════════════════════════════════════════════════════════════
// §0 THE ORACLE — an independently written reference quotient, FROM THE SPEC.
//
// Sources, cited per rule (docs/adr/0021):
//   [§3] IDENTIFY MEANS MERGE (path-1): A ≡ B become ONE edge-class carrying
//        the UNION of their wedges; only the DECLARED classes merge; path-2
//        (endpoints merged, two classes kept) is NOT edge-identification.
//   [§4] THE ENACTMENT LAW (D3): materialize the quotient — rewrite every edge
//        endpoint AND face cycle through resultOf; de-duplicate the identified
//        classes; never merely record the ledger.
//   [§5] THE SIGNED-CLASS LAW: carry each edge's EXPLICIT class identity and
//        SIGN through the quotient; NEVER endpoint-derived (endpoint re-keying
//        fuses parallel classes and corrupts χ).
//   [§6] THE MODE LAW's measured ground: cylinder rims — preserving → TORUS
//        (w₁=0), reversing → KLEIN (w₁=1); at generation four — genus-2 vs N₄.
//   [math] the standard fundamental-polygon fact: an orientation-COMPATIBLE
//        seam is the a…a⁻¹ pairing — the two faces traverse the merged edge in
//        OPPOSITE directions; the a…a pairing (SAME direction) is the flip.
//        Hence, writing wArrow(e) for the direction the (unique) incident face
//        wedge traverses a FREE edge e:
//          PRESERVING: wArrow(B) glues ANTI-parallel to wArrow(A)
//                      ⇒ tail(A)~head(B), head(A)~tail(B), τ(B) = −1;
//          REVERSING:  parallel ⇒ tail~tail, head~head, τ(B) = +1.
//        (If this derivation had the convention backwards, §a's external
//        grounding — the certifier reading TORUS on the oracle's own
//        preserving output — would fail. The spec's outcomes arbitrate.)
//   [SPEC GAP — flagged, not resolved]: for an INTERIOR edge (≥2 wedges) the
//        spec pins no direction reference, and the choice changes which vertex
//        pairs merge. The oracle refuses to guess: such pairs still MERGE
//        their classes [§3], but vertex unions and signs for them are marked
//        UNPINNED and the compare restricts to the direction-free structure.
//        This is a question for the researcher, recorded in the report.
//
// BLINDNESS DISCLOSURE: the oracle below cites only the spec clauses above.
// The builder's context did carry `identifyOnComplex`'s source from an earlier
// (reverted) build this session; it was not consulted for any rule here, and
// the spec gap above was deliberately NOT filled with the enactment's known
// tie-break. The mutation battery (§m) and the external groundings (§a, §e)
// are the objective evidence this oracle is a witness, not an echo.
// ═════════════════════════════════════════════════════════════════════════════

function makeUF() {
  const parent = new Map();
  const find = (x) => {
    if (!parent.has(x)) parent.set(x, x);
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r);
    let c = x;
    while (parent.get(c) !== r) {
      const n = parent.get(c);
      parent.set(c, r);
      c = n;
    }
    return r;
  };
  return { find, union: (a, b) => parent.set(find(a), find(b)) };
}

function oracleQuotient(input, cycleA, cycleB, modes) {
  // ---- the op contract on inputs (matched, distinct, disjoint, on-complex) --
  if (cycleA.length === 0 || cycleA.length !== cycleB.length || modes.length !== cycleA.length) {
    throw new Error('oracle: walks must be matched and non-empty, one mode per pair');
  }
  const edgeById = new Map(input.edges.map((e) => [e.id, e]));
  for (const id of [...cycleA, ...cycleB]) {
    if (!edgeById.has(id)) throw new Error(`oracle: edge "${id}" not on the complex`);
  }
  if (new Set(cycleA).size !== cycleA.length || new Set(cycleB).size !== cycleB.length) {
    throw new Error('oracle: a walk repeats a class');
  }
  if (cycleA.some((id) => cycleB.includes(id))) throw new Error('oracle: the walks share a class');

  // ---- wedges: which face slots traverse each edge, and how -----------------
  const wedgesOf = new Map(input.edges.map((e) => [e.id, []]));
  input.faces.forEach((face, f) => {
    face.boundary.forEach((slot, k) => {
      wedgesOf.get(slot.edge).push({ f, k, dir: slot.dir });
    });
  });
  // wArrow(e): the traversal of e by its UNIQUE wedge — pinned only for FREE
  // edges [math above]; interior ⇒ null (the flagged spec gap).
  const wArrowOf = (id) => {
    const w = wedgesOf.get(id);
    if (w.length !== 1) return null;
    const e = edgeById.get(id);
    return w[0].dir === 1 ? [e.u, e.v] : [e.v, e.u];
  };

  // ---- [§3] merge the DECLARED classes, pairwise; [math] vertex unions ------
  const vertexUF = makeUF();
  for (const v of input.vertices) vertexUF.find(v);
  const classOfEdge = new Map(); // edge id -> class descriptor
  const restrictions = [];
  const classes = [];
  for (let i = 0; i < cycleA.length; i += 1) {
    const a = cycleA[i];
    const b = cycleB[i];
    const arrowA = wArrowOf(a);
    const arrowB = wArrowOf(b);
    const pinned = arrowA !== null && arrowB !== null;
    if (!pinned) restrictions.push(`pair ${i} (${a} ≡ ${b}): interior-edge direction reference is UNPINNED by the spec`);
    if (pinned) {
      if (modes[i] === 'preserving') {
        // anti-parallel seam: tail(A)~head(B), head(A)~tail(B)
        vertexUF.union(arrowA[0], arrowB[1]);
        vertexUF.union(arrowA[1], arrowB[0]);
      } else {
        vertexUF.union(arrowA[0], arrowB[0]);
        vertexUF.union(arrowA[1], arrowB[1]);
      }
    }
    const cls = {
      members: [a, b],
      refWedgeDir: new Map(pinned ? [[a, wedgesOf.get(a)[0].dir], [b, wedgesOf.get(b)[0].dir]] : []),
      tau: new Map(pinned ? [[a, 1], [b, modes[i] === 'preserving' ? -1 : 1]] : []),
      gaugeRep: a,
      pinned,
    };
    classes.push(cls);
    classOfEdge.set(a, cls);
    classOfEdge.set(b, cls);
  }
  // every UNDECLARED edge keeps its own class [§5 — never endpoint-derived]
  for (const e of input.edges) {
    if (!classOfEdge.has(e.id)) {
      const cls = { members: [e.id], refWedgeDir: new Map([[e.id, 1]]), tau: new Map([[e.id, 1]]), gaugeRep: e.id, pinned: true, written: true };
      classes.push(cls);
      classOfEdge.set(e.id, cls);
    }
  }
  for (const cls of classes) cls.key = `E[${setKey(cls.members)}]`;

  // ---- vertex classes → π [§4: everything rewrites through resultOf] --------
  const membersOfRoot = new Map();
  for (const v of input.vertices) {
    const r = vertexUF.find(v);
    (membersOfRoot.get(r) ?? membersOfRoot.set(r, []).get(r)).push(v);
  }
  const vertexClassOf = new Map(); // original vertex -> class key
  const vertexClasses = new Map(); // class key -> sorted members
  for (const members of membersOfRoot.values()) {
    const key = `V[${setKey(members)}]`;
    vertexClasses.set(key, [...members].sort((a, b) => a.localeCompare(b)));
    for (const m of members) vertexClassOf.set(m, key);
  }
  const pi = (v) => vertexClassOf.get(v);

  // ---- signs: sign(slot on e) = τ(e) · d_slot · d_refWedge(e) [derived §0] --
  // (for an unmerged class the gauge is e's WRITTEN orientation, so sign = d.)
  const signOfSlot = (slot) => {
    const cls = classOfEdge.get(slot.edge);
    if (!cls.pinned) return null; // unpinned pair — restricted leg
    if (cls.written) return slot.dir;
    return cls.tau.get(slot.edge) * slot.dir * cls.refWedgeDir.get(slot.edge);
  };
  const faces = input.faces.map((face) => ({
    slots: face.boundary.map((slot) => ({ classKey: classOfEdge.get(slot.edge).key, sign: signOfSlot(slot) })),
  }));

  // ---- gauge arrows (class endpoints in vertex classes) ---------------------
  for (const cls of classes) {
    if (cls.written) {
      const e = edgeById.get(cls.gaugeRep);
      cls.arrow = [pi(e.u), pi(e.v)];
    } else if (cls.pinned) {
      const a = wArrowOf(cls.gaugeRep);
      cls.arrow = [pi(a[0]), pi(a[1])];
    } else {
      const e = edgeById.get(cls.gaugeRep); // endpoints as a SET are still spec-true
      cls.arrow = null;
      cls.endpointSet = [pi(e.u), pi(e.v)];
    }
  }

  // ---- wedge counts [§3: the union of wedges] --------------------------------
  const wedgeCountOf = new Map(classes.map((cls) => [cls.key, cls.members.reduce((n, m) => n + wedgesOf.get(m).length, 0)]));
  const freeKeys = classes.filter((c) => wedgeCountOf.get(c.key) < 2).map((c) => c.key).sort();
  const junctionKeys = classes.filter((c) => wedgeCountOf.get(c.key) > 2).map((c) => c.key).sort();

  // ---- G4 ledger membership: ALL source sites, forward = π --------------------
  const ledgerPullBack = new Map();
  for (const [key, members] of vertexClasses) ledgerPullBack.set(key, members);

  // ---- the oracle's OWN AssembledComplex (its gauge) — for the certifier -----
  const assembled = {
    vertices: [...vertexClasses.keys()].sort((a, b) => a.localeCompare(b)),
    edges: classes.map((cls) => ({
      id: cls.key,
      u: cls.arrow ? cls.arrow[0] : cls.endpointSet[0],
      v: cls.arrow ? cls.arrow[1] : cls.endpointSet[1],
    })),
    faces: faces.map((f) => ({ boundary: f.slots.map((s) => ({ edge: s.classKey, dir: s.sign ?? 1 })) })),
  };

  return {
    vertexClassOf,
    vertexClasses,
    classOfEdge,
    classes,
    faces,
    wedgeCountOf,
    freeKeys,
    junctionKeys,
    ledgerPullBack,
    assembled,
    restrictions,
    pi,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// §1 THE COMPARE — pure structure, positional (the spec pins no id formats):
// faces are rewritten IN PLACE [§4], so slot (f,k) of the enactment and slot
// (f,k) of the oracle must carry THE SAME class — the two slot-partitions must
// coincide — and every other leg hangs off the bijections that induces.
// Named legs, so the mutation battery can assert WHAT caught the defect.
// A `translate` maps enactment-side member/corner ids into the oracle's input
// vocabulary (identity at generation 1; the maintained bijections deeper).
// ═════════════════════════════════════════════════════════════════════════════

function compareIdentification(oracle, enact, opts = {}) {
  const failed = new Set();
  const notes = [];
  const tV = (opts.translate && opts.translate.v) || ((x) => x);
  const inputFaces = opts.inputShapeFaces ?? null;
  const complex = enact.complex;

  // ---- edge classes: the slot partitions must coincide -----------------------
  const cToE = new Map();
  const eToC = new Map();
  if (complex.faces.length !== oracle.faces.length) {
    failed.add('edge-partition');
    notes.push(`face count ${complex.faces.length} vs oracle ${oracle.faces.length}`);
  } else {
    complex.faces.forEach((face, f) => {
      if (face.boundary.length !== oracle.faces[f].slots.length) {
        failed.add('edge-partition');
        return;
      }
      face.boundary.forEach((slot, k) => {
        const cKey = oracle.faces[f].slots[k].classKey;
        const eId = slot.edge;
        if (cToE.has(cKey) && cToE.get(cKey) !== eId) failed.add('edge-partition');
        if (eToC.has(eId) && eToC.get(eId) !== cKey) failed.add('edge-partition');
        cToE.set(cKey, eId);
        eToC.set(eId, cKey);
      });
    });
  }
  const enactEdgeIds = new Set(complex.edges.map((e) => e.id));
  for (const eId of eToC.keys()) {
    if (!enactEdgeIds.has(eId)) {
      failed.add('edge-partition');
      notes.push(`slot references edge "${eId}" absent from the edge list`);
    }
  }
  if (complex.edges.length !== oracle.classes.length) {
    failed.add('counts');
    notes.push(`E ${complex.edges.length} vs oracle ${oracle.classes.length}`);
  }

  // ---- vertex classes: ledger membership is the enactment's own claim --------
  const vToC = new Map(); // enact vertex id -> oracle vertex class key
  if (enact.ledger) {
    const enactSets = new Map(); // enact target id -> sorted members (translated)
    for (const [target, members] of Object.entries(enact.ledger.pullBack)) {
      enactSets.set(target, setKey(members.map(tV)));
    }
    const oracleSets = new Map(); // memberSetKey -> oracle class key
    for (const [key, members] of oracle.ledgerPullBack) oracleSets.set(setKey(members), key);
    if (enactSets.size !== oracle.ledgerPullBack.size) failed.add('ledger');
    for (const [target, sk] of enactSets) {
      const oKey = oracleSets.get(sk);
      if (!oKey) {
        failed.add('ledger');
        notes.push(`enactment class {${sk}} has no oracle counterpart`);
      } else {
        vToC.set(target, oKey);
      }
    }
  }
  // minted vertices carry their absorbed members [§4's carried-not-minted]
  if (enact.shape) {
    for (const vertex of Object.values(enact.shape.vertices)) {
      const isMinted = vertex.createdBy && vertex.createdBy.shapeId === enact.shape.id;
      const members = isMinted ? vertex.createdBy.sourceVertexIds.map(tV) : [tV(vertex.id)];
      const oKey = oracle.vertexClasses.size ? [...oracle.vertexClasses.entries()].find(([, m]) => setKey(m) === setKey(members)) : null;
      if (!oKey) {
        failed.add('vertex-partition');
        notes.push(`shape vertex ${vertex.id} carries members {${setKey(members)}} — no oracle class`);
      } else if (vToC.has(vertex.id) && vToC.get(vertex.id) !== oKey[0]) {
        failed.add('vertex-partition');
      } else {
        vToC.set(vertex.id, oKey[0]);
      }
    }
  }
  // complex vertex list ↔ oracle classes (counts + coverage)
  if (complex.vertices.length !== oracle.vertexClasses.size) {
    failed.add('counts');
    notes.push(`V ${complex.vertices.length} vs oracle ${oracle.vertexClasses.size}`);
  }

  // ---- born shape face cycles: rewritten through resultOf [§4, shape layer] --
  if (enact.shape && inputFaces) {
    if (enact.shape.faces.length !== inputFaces.length) failed.add('shape-cycles');
    enact.shape.faces.forEach((face, f) => {
      const source = inputFaces[f];
      if (!source || face.vertexIds.length !== source.vertexIds.length) {
        failed.add('shape-cycles');
        return;
      }
      face.vertexIds.forEach((cornerId, k) => {
        const expected = oracle.pi(tV(source.vertexIds[k]));
        const got = vToC.get(cornerId);
        if (!expected || !got || expected !== got) failed.add('shape-cycles');
      });
    });
  }

  // ---- endpoints + signed slots [§5: explicit class identity AND sign] -------
  const edgeByIdEnact = new Map(complex.edges.map((e) => [e.id, e]));
  for (const cls of oracle.classes) {
    const eId = cToE.get(cls.key);
    if (!eId) continue; // already failed above
    const enactEdge = edgeByIdEnact.get(eId);
    if (!enactEdge) continue;
    const endpoints = [vToC.get(enactEdge.u), vToC.get(enactEdge.v)];
    if (!cls.pinned) {
      // the flagged spec gap: endpoints only as a SET, no sign leg
      if (opts.edgeSideOnly !== true) notes.push(`class ${cls.key}: sign legs restricted (unpinned interior reference)`);
      continue;
    }
    const oracleArrow = cls.arrow;
    const enactSlots = [];
    const oracleSlots = [];
    complex.faces.forEach((face, f) =>
      face.boundary.forEach((slot, k) => {
        if (slot.edge === eId) {
          enactSlots.push(slot.dir);
          oracleSlots.push(oracle.faces[f].slots[k].sign);
        }
      }),
    );
    const isLoop = oracleArrow[0] === oracleArrow[1];
    if (!isLoop) {
      let g = null;
      if (endpoints[0] === oracleArrow[0] && endpoints[1] === oracleArrow[1]) g = 1;
      else if (endpoints[0] === oracleArrow[1] && endpoints[1] === oracleArrow[0]) g = -1;
      if (g === null) {
        failed.add('vertex-partition');
        notes.push(`class ${cls.key}: enactment endpoints do not match the oracle arrow`);
        continue;
      }
      for (let i = 0; i < enactSlots.length; i += 1) {
        if (enactSlots[i] !== g * oracleSlots[i]) failed.add('slot-dirs');
      }
    } else {
      if (endpoints[0] !== oracleArrow[0] || endpoints[1] !== oracleArrow[1]) failed.add('vertex-partition');
      for (let i = 0; i < enactSlots.length; i += 1) {
        for (let j = i + 1; j < enactSlots.length; j += 1) {
          if (enactSlots[i] * enactSlots[j] !== oracleSlots[i] * oracleSlots[j]) failed.add('slot-dirs');
        }
      }
    }
  }

  // ---- free / junction sets (the union-of-wedges arithmetic [§3]) ------------
  if (enact.gate) {
    const mapIds = (ids) => [...ids].map((id) => eToC.get(id) ?? `?${id}`).sort();
    if (!eq(mapIds(enact.gate.freeEdgeIds), oracle.freeKeys)) failed.add('gate-sets');
    if (!eq(mapIds(enact.gate.junctionEdgeIds), oracle.junctionKeys)) failed.add('gate-sets');
  }

  if (opts.edgeSideOnly === true) {
    // the interior case: only the direction-free legs count (disclosed)
    for (const leg of ['vertex-partition', 'slot-dirs', 'shape-cycles', 'ledger', 'counts', 'gate-sets']) failed.delete(leg);
    if (enact.gate) {
      const mapIds = (ids) => [...ids].map((id) => eToC.get(id) ?? `?${id}`).sort();
      if (!eq(mapIds(enact.gate.junctionEdgeIds), oracle.junctionKeys)) failed.add('gate-sets');
    }
  }

  return { agree: failed.size === 0, failed: [...failed].sort(), notes, eToC, vToC, cToE };
}

const showDisagreement = (label, cmp) => {
  if (!cmp.agree) {
    note(`⛔ DISAGREEMENT on ${label}: legs [${cmp.failed.join(', ')}] — ${cmp.notes.slice(0, 3).join(' · ')}`);
  }
};

console.log('the differential oracle: identifyOnComplex meets its independent witness (blind concretes)\n');

// ═════ [w] CLAUSE 1 — execute what you witness ═══════════════════════════════
console.log("----- [w] CLAUSE 1: via === 'general' or it is not a witness -----");
const sqW = loadForm(nGon(4), 'orw');
const eSq = (k) => {
  const vs = sqW.faces[0].vertexIds;
  return sqW.edges.find((e) => {
    const [a, b] = [vs[k], vs[(k + 1) % 4]];
    return (e.vertexIds[0] === a && e.vertexIds[1] === b) || (e.vertexIds[0] === b && e.vertexIds[1] === a);
  }).id;
};
const squareIdentify = identify(sqW, [eSq(0)], [eSq(2)], 'preserving');
check("the square identify reads via 'committed-word' — the DELEGATION: such a case is NOT a witness of the enactment and is counted by NOTHING below (had the five-word compare asserted via === 'general', it would have failed on day one)",
  squareIdentify.via === 'committed-word');

// ═════ [a] cylinder rims, both modes — agreement + the external ground ═══════
console.log('\n----- [a] cylinder rims: preserving → torus · reversing → Klein (via general; oracle agrees; oracle ALONE certifies) -----');
const runAgreement = (form, mode, inputComplex, inputFaces) => {
  const sewn = sewBoundaryCircles(form, mode);
  const walks = { cycleA: sewn.spec.cycleA, cycleB: sewn.spec.cycleB, modes: sewn.spec.modes };
  const oracle = oracleQuotient(inputComplex, walks.cycleA, walks.cycleB, walks.modes);
  const cmp = compareIdentification(oracle, sewn, { inputShapeFaces: inputFaces });
  return { sewn, oracle, cmp, walks };
};
const cyl = copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'orA');
const cylAcq = acquireFaithfulComplex(cyl, null);
const cylWalks = walkBoundaryCircles(cylAcq.complex);
check('fixture: the committed 16-face cylinder rep, direct-acquired, two 4-edge rims (the input is NOT the enactment\'s output)',
  cylAcq.source === 'direct' && cylWalks !== null && cylWalks.length === 2 && cylWalks.every((c) => c.edgeIds.length === 4));
const aP = runAgreement(cyl, 'preserving', cylAcq.complex, cyl.faces);
check("PRESERVING rim sew: via === 'general' AND the oracle agrees on the FULL byte-structure (edge classes, vertex classes, signed slots, shape cycles, ledger membership, gate sets)",
  aP.sewn.via === 'general' && aP.cmp.agree);
showDisagreement('cylinder preserving', aP.cmp);
const aK = runAgreement(cyl, 'reversing', cylAcq.complex, cyl.faces);
check("REVERSING rim sew: via === 'general' AND the oracle agrees on the full byte-structure",
  aK.sewn.via === 'general' && aK.cmp.agree);
showDisagreement('cylinder reversing', aK.cmp);
// §5 GROUNDING — the ORACLE'S OWN complexes certify to the externally-derived
// truths (researcher's cylinder-rim seal), no enactment in the loop:
const certP = analyzeGlobalW1(aP.oracle.assembled);
const certK = analyzeGlobalW1(aK.oracle.assembled);
const clsP = classifyComplexComponent(aP.oracle.assembled);
const clsK = classifyComplexComponent(aK.oracle.assembled);
check('★ the ORACLE ALONE reproduces the researcher\'s seal: its OWN preserving quotient certifies χ=0, w₁=0 and classifies "genus 1" — THE TORUS',
  certP.debug.euler === 0 && !certP.cert.nonOrientable && clsP.ok && classLabel(clsP.class) === 'genus 1');
check('★ …and its OWN reversing quotient certifies χ=0, w₁=1 and classifies "2 cross-caps" — THE KLEIN BOTTLE (the mode convention is arbitrated by the spec\'s outcomes, not by the enactment)',
  certK.debug.euler === 0 && certK.cert.nonOrientable && clsK.ok && classLabel(clsK.class) === '2 cross-caps');
note(`oracle-only: preserving χ=${certP.debug.euler} w₁=${certP.cert.nonOrientable ? 1 : 0} → ${classLabel(clsP.class)} · reversing w₁=${certK.cert.nonOrientable ? 1 : 0} → ${classLabel(clsK.class)}`);

// ═════ [b] the trap-sensitive parallel-class rep ═════════════════════════════
console.log('\n----- [b] the height-1 tube: the sewn torus CARRIES parallel seam classes (the route-B condition) -----');
const tube41 = loadForm(() => ({
  name: 'tube4x1',
  vertices: [
    { id: 'a0', position: [1, 0, 0] }, { id: 'a1', position: [0, 0, 1] }, { id: 'a2', position: [-1, 0, 0] }, { id: 'a3', position: [0, 0, -1] },
    { id: 'b0', position: [1, 1, 0] }, { id: 'b1', position: [0, 1, 1] }, { id: 'b2', position: [-1, 1, 0] }, { id: 'b3', position: [0, 1, -1] },
  ],
  faces: [0, 1, 2, 3].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 4}`, `b${(i + 1) % 4}`, `b${i}`] })),
}), 'tb');
const tubeAcq = acquireFaithfulComplex(tube41, null);
const bT = runAgreement(tube41, 'preserving', tubeAcq.complex, tube41.faces);
const parallelPairs = (() => {
  const key = (e) => setKey([e.u, e.v]);
  const seen = new Map();
  let parallels = 0;
  for (const e of bT.sewn.complex.edges) {
    if (seen.has(key(e))) parallels += 1;
    seen.set(key(e), e.id);
  }
  return parallels;
})();
check("the tube's preserving sew: via === 'general', the result GENUINELY carries parallel classes (endpoint-keying would fuse them), and the oracle agrees on the full byte-structure",
  bT.sewn.via === 'general' && parallelPairs > 0 && bT.cmp.agree);
showDisagreement('tube4x1 preserving', bT.cmp);
check('…and the oracle\'s OWN tube quotient certifies the 4×1 torus: χ=0, w₁=0, V=4 E=8 F=4',
  (() => {
    const c = analyzeGlobalW1(bT.oracle.assembled);
    return c.debug.euler === 0 && !c.cert.nonOrientable &&
      bT.oracle.assembled.vertices.length === 4 && bT.oracle.assembled.edges.length === 8 && bT.oracle.assembled.faces.length === 4;
  })());

// ═════ [c] interior identification — the flagged spec gap, restricted ════════
console.log('\n----- [c] interior identification: enacted, gate-refused; compare restricted to the direction-free structure -----');
const cylC = copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'orC');
const cylCAcq = acquireFaithfulComplex(cylC, null);
const wedgeCount = new Map();
for (const e of cylCAcq.complex.edges) wedgeCount.set(e.id, 0);
for (const f of cylCAcq.complex.faces) for (const s of f.boundary) wedgeCount.set(s.edge, (wedgeCount.get(s.edge) ?? 0) + 1);
const interiorIds = cylCAcq.complex.edges.filter((e) => wedgeCount.get(e.id) === 2).map((e) => e.id);
const interiorResult = identify(cylC, [interiorIds[0]], [interiorIds[5]], 'preserving');
const interiorOracle = oracleQuotient(cylCAcq.complex, [interiorIds[0]], [interiorIds[5]], ['preserving']);
const interiorCmp = compareIdentification(interiorOracle, interiorResult, { edgeSideOnly: true });
check("interior identification: via === 'general'; the oracle predicts the SAME merged 4-wedge junction class and the same slot partition; the gate refuses as predicted",
  interiorResult.via === 'general' &&
  interiorOracle.junctionKeys.length === 1 &&
  interiorOracle.wedgeCountOf.get(interiorOracle.junctionKeys[0]) === 4 &&
  interiorCmp.agree &&
  interiorResult.gate.manifold === false);
showDisagreement('interior', interiorCmp);
check('…the SPEC GAP is on the record, not silently filled: the oracle marks the interior pair\'s direction reference UNPINNED (docs/adr/0021 §§3–5 pin no reference wedge for a 2-wedge edge) — the vertex/sign legs are restricted and the question goes to the researcher',
  interiorOracle.restrictions.length === 1 && /UNPINNED/.test(interiorOracle.restrictions[0]));
note(`restriction: ${interiorOracle.restrictions[0]}`);

// ═════ [d]+[e] the 8×1 tube and THE DEPTH-4 CHAIN ════════════════════════════
console.log('\n----- [d]/[e] the depth-4 chain on the 8×1 tube: the oracle maintains ITS OWN complex through every generation -----');
const tube81 = loadForm(() => ({
  name: 'tube8x1',
  vertices: [
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `a${i}`, position: [Math.cos((i * Math.PI) / 4), 0, Math.sin((i * Math.PI) / 4)] })),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `b${i}`, position: [Math.cos((i * Math.PI) / 4), 1, Math.sin((i * Math.PI) / 4)] })),
  ],
  faces: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 8}`, `b${(i + 1) % 8}`, `b${i}`] })),
}), 'ub7');
const t81Acq = acquireFaithfulComplex(tube81, null);

// GEN 1 — sew (identifyOnComplex runs; the oracle sews its own copy)
const g1 = runAgreement(tube81, 'preserving', t81Acq.complex, tube81.faces);
check("gen 1 (sew, 8 faces — a genuine multi-face complex, the n/2 parallel seam): via === 'general' AND the oracle agrees on the full byte-structure",
  g1.sewn.via === 'general' && g1.cmp.agree);
showDisagreement('gen1 sew', g1.cmp);
const S1 = g1.sewn.shape;
// the maintained bijections (enactment id -> oracle class key), gen-1 vintage
const vBij = (id) => g1.cmp.vToC.get(id) ?? id;
const eBij = (id) => g1.cmp.eToC.get(id) ?? id;

// GEN 2 — cut (committed op, not under test; the oracle drops the SAME face)
const cutFaceOf = (parent, face) => materializeCutResult(parent, cutCell(parent, face));
const C1 = cutFaceOf(S1, S1.faces[0]);
const cutIndex1 = S1.faces.findIndex((f) => !C1.faces.some((cf) => cf.id === f.id));
const oracleGen2 = { ...g1.oracle, assembled: { ...g1.oracle.assembled, faces: g1.oracle.assembled.faces.filter((_f, k) => k !== cutIndex1) } };
const enactGen2 = acquireComplex(C1, [S1, tube81]);
const compareComplexOnly = (oracleAssembled, enactComplex) => {
  // slot-partition + endpoint compare through the maintained bijections
  const failed = [];
  if (enactComplex.faces.length !== oracleAssembled.faces.length) failed.push('faces');
  enactComplex.faces.forEach((face, f) => {
    const oFace = oracleAssembled.faces[f];
    if (!oFace || face.boundary.length !== oFace.boundary.length) {
      failed.push('slots');
      return;
    }
    face.boundary.forEach((slot, k) => {
      if (eBij(slot.edge) !== oFace.boundary[k].edge) failed.push('edge-partition');
    });
  });
  const oracleEdgeById = new Map(oracleAssembled.edges.map((e) => [e.id, e]));
  for (const e of enactComplex.edges) {
    const o = oracleEdgeById.get(eBij(e.id));
    if (!o) {
      failed.push('edge-set');
      continue;
    }
    if (setKey([vBij(e.u), vBij(e.v)]) !== setKey([o.u, o.v])) failed.push('endpoints');
  }
  if (enactComplex.vertices.length !== oracleAssembled.vertices.length || enactComplex.edges.length !== oracleAssembled.edges.length) failed.push('counts');
  return { agree: failed.length === 0, failed: [...new Set(failed)] };
};
const g2cmp = compareComplexOnly(oracleGen2.assembled, enactGen2.complex);
check(`gen 2 (cut): the engine's chain-acquired complex (source '${enactGen2 ? enactGen2.source : 'none'}' — it REPLAYS the gen-1 identification) matches the oracle's own face-dropped state`,
  enactGen2 !== null && enactGen2.source === 'cut-derived' && g2cmp.agree);
if (!g2cmp.agree) note(`gen2 legs: ${g2cmp.failed.join(', ')}`);

// GEN 3 — the second cut (vertex-disjoint face)
const firstFace = S1.faces[0];
const disjointFace = C1.faces.find((f) => f.vertexIds.every((v) => !firstFace.vertexIds.includes(v)));
const C2 = cutFaceOf(C1, disjointFace);
const cutIndex2 = C1.faces.findIndex((f) => !C2.faces.some((cf) => cf.id === f.id));
const oracleGen3 = { ...oracleGen2, assembled: { ...oracleGen2.assembled, faces: oracleGen2.assembled.faces.filter((_f, k) => k !== cutIndex2) } };
const enactGen3 = acquireComplex(C2, [C1, S1, tube81]);
const g3cmp = compareComplexOnly(oracleGen3.assembled, enactGen3.complex);
check('gen 3 (second cut, vertex-disjoint): chain-acquired complex ≡ the oracle\'s own state — two boundary circles open',
  enactGen3 !== null && g3cmp.agree &&
  (() => {
    const w = new Map();
    for (const e of oracleGen3.assembled.edges) w.set(e.id, 0);
    for (const f of oracleGen3.assembled.faces) for (const s of f.boundary) w.set(s.edge, (w.get(s.edge) ?? 0) + 1);
    const free = [...w.values()].filter((n) => n === 1).length;
    return free === 8; // two 4-edge circles
  })());
if (!g3cmp.agree) note(`gen3 legs: ${g3cmp.failed.join(', ')}`);

// GEN 4 — re-sew, BOTH modes (the enactment runs identifyOnComplex on the
// chain-acquired complex; the oracle sews ITS OWN gen-3 state with the SAME
// walks, translated through the maintained bijections)
const gen4Of = (mode) => {
  const sewn = sewBoundaryCircles(C2, mode, 0, 1, [C1, S1, tube81]);
  const walksA = sewn.spec.cycleA.map(eBij);
  const walksB = sewn.spec.cycleB.map(eBij);
  const oracle = oracleQuotient(oracleGen3.assembled, walksA, walksB, sewn.spec.modes);
  const cmp = compareIdentification(oracle, sewn, {
    inputShapeFaces: C2.faces,
    translate: { v: vBij },
  });
  return { sewn, oracle, cmp };
};
const g4P = gen4Of('preserving');
check("gen 4 (re-sew, PRESERVING): via === 'general' AND the oracle — four generations deep, never once consuming the enactment's structure — agrees on the full byte-structure",
  g4P.sewn.via === 'general' && g4P.cmp.agree);
showDisagreement('gen4 preserving', g4P.cmp);
const g4R = gen4Of('reversing');
check("gen 4 (re-sew, REVERSING): via === 'general' AND the oracle agrees",
  g4R.sewn.via === 'general' && g4R.cmp.agree);
showDisagreement('gen4 reversing', g4R.cmp);
// §5 GROUNDING — the mothership's hand-derived depth-4 pair, on the ORACLE'S OWN outputs:
const certG4P = analyzeGlobalW1(g4P.oracle.assembled);
const certG4R = analyzeGlobalW1(g4R.oracle.assembled);
const clsG4P = classifyComplexComponent(g4P.oracle.assembled);
const clsG4R = classifyComplexComponent(g4R.oracle.assembled);
check('★ the ORACLE ALONE reproduces the depth-4 truth: preserving → χ=−2, w₁=0, b₁=4, "genus 2" — the mothership\'s hand-derived surface',
  certG4P.debug.euler === -2 && !certG4P.cert.nonOrientable && certG4P.cert.b1 === 4 && clsG4P.ok && classLabel(clsG4P.class) === 'genus 2');
check('★ …and reversing → χ=−2, w₁=1, "4 cross-caps" — N₄ (the mode STILL BITES at generation four, exactly as the spec grounds it)',
  certG4R.debug.euler === -2 && certG4R.cert.nonOrientable && clsG4R.ok && classLabel(clsG4R.class) === '4 cross-caps');
note(`oracle-only gen4: preserving χ=${certG4P.debug.euler} b₁=${certG4P.cert.b1} → ${classLabel(clsG4P.class)} · reversing → ${classLabel(clsG4R.class)}`);

// ═════ [m] ★ CLAUSE 2 — THE MUTATION BATTERY ═════════════════════════════════
console.log('\n----- [m] ★ the mutation battery: five distinct defects, each VISIBLY caught (else the oracle is VOID) -----');
// The mutants are built by targeted IN-MEMORY string surgery on the enactment
// and compiled as SEPARATE module instances (never touching disk). Writing
// these transforms is the ONE sanctioned contact with the enactment's text
// (§4 of the mandate operates ON the code by definition); the ORACLE above
// was written first and cites only the spec. Every anchor's hit-count is
// asserted, so a moved enactment fails LOUDLY instead of silently un-mutating.
const ciPath = path.join(repoRoot, 'src', 'lib', 'complexIdentification.ts');
const ciSource = fs.readFileSync(ciPath, 'utf8');
function compileMutant(label, replacements) {
  let src = ciSource;
  for (const { find, replace, count } of replacements) {
    const hits = src.split(find).length - 1;
    if (hits !== count) {
      throw new Error(`mutant ${label}: anchor "${find.slice(0, 48)}…" hit ${hits}×, expected ${count} — re-anchor the battery, never skip it`);
    }
    src = src.split(find).join(replace);
  }
  const fake = path.join(path.dirname(ciPath), `complexIdentification.__mutant_${label}__.ts`);
  const m = new Module(fake, module);
  m.filename = fake;
  m.paths = Module._nodeModulePaths(path.dirname(fake));
  m._compile(ts.transpileModule(src, { ...TRANSPILE_OPTIONS, fileName: fake }).outputText, fake);
  return m.exports;
}
// each battery case: run the mutant enactment on a fixture that EXERCISES the
// defect, oracle-compare, and assert the compare FAILS on the expected leg(s).
const mutantCase = (label, replacements, runCase, expectedLegs) => {
  let caught = false;
  let legs = [];
  let corruption = '';
  try {
    const mutant = compileMutant(label, replacements);
    const { sewn, oracle, cmpOpts } = runCase(mutant);
    if (sewn.via !== 'general') throw new Error(`mutant ${label}: case did not execute the enactment (via=${sewn.via})`);
    const cmp = compareIdentification(oracle, sewn, cmpOpts ?? {});
    caught = !cmp.agree && expectedLegs.some((leg) => cmp.failed.includes(leg));
    legs = cmp.failed;
    try {
      const cert = analyzeGlobalW1(sewn.complex);
      corruption = `mutant certifies χ=${cert.debug.euler} w₁=${cert.cert.nonOrientable ? 1 : 0}`;
    } catch (e) {
      corruption = `mutant complex un-certifiable (${String(e.message).slice(0, 40)}…)`;
    }
  } catch (error) {
    // a mutant that cannot even run is reported, not counted as a catch
    return { caught: false, legs: [`threw: ${error.message.slice(0, 80)}`], corruption };
  }
  return { caught, legs, corruption };
};
const cylinderCase = (mutant) => {
  const cylM = copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'orA'); // same namespace: same fixture bytes
  const sewn = mutant.sewBoundaryCircles(cylM, 'preserving');
  const oracle = oracleQuotient(cylAcq.complex, sewn.spec.cycleA, sewn.spec.cycleB, sewn.spec.modes);
  return { sewn, oracle, cmpOpts: { inputShapeFaces: cylM.faces } };
};
const tubeCase = (mutant) => {
  const tubeM = loadForm(() => ({
    name: 'tube4x1',
    vertices: [
      { id: 'a0', position: [1, 0, 0] }, { id: 'a1', position: [0, 0, 1] }, { id: 'a2', position: [-1, 0, 0] }, { id: 'a3', position: [0, 0, -1] },
      { id: 'b0', position: [1, 1, 0] }, { id: 'b1', position: [0, 1, 1] }, { id: 'b2', position: [-1, 1, 0] }, { id: 'b3', position: [0, 1, -1] },
    ],
    faces: [0, 1, 2, 3].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 4}`, `b${(i + 1) % 4}`, `b${i}`] })),
  }), 'tb');
  const sewn = mutant.sewBoundaryCircles(tubeM, 'preserving');
  const oracle = oracleQuotient(tubeAcq.complex, sewn.spec.cycleA, sewn.spec.cycleB, sewn.spec.modes);
  return { sewn, oracle, cmpOpts: { inputShapeFaces: tubeM.faces } };
};

// (1) THE ROUTE-B TRAP — endpoint-keyed edge classes (parallel classes fuse)
const m1 = mutantCase('routeB',
  [{
    find: '    enactedEdges.push({ id, u, v });',
    replace: '    if (!enactedEdges.some((prior) => (prior.u === u && prior.v === v) || (prior.u === v && prior.v === u))) enactedEdges.push({ id, u, v });',
    count: 1,
  }],
  tubeCase, ['edge-partition', 'counts']);
check(`mutation 1 — ENDPOINT-KEYED classes (the route-B trap), on the parallel-class tube: the oracle CATCHES it [${m1.legs.join(', ')}]`, m1.caught);
note(`route-B mutant: ${m1.corruption} (truth: χ=0 w₁=0)`);

// (2) FLIPPED wedge-direction convention (preserving ↔ reversing) — w₁ corrupts
const m2 = mutantCase('flipMode',
  [{ find: "modes[i] === 'preserving'", replace: "modes[i] === 'reversing'", count: 2 }],
  cylinderCase, ['vertex-partition', 'ledger', 'slot-dirs']);
check(`mutation 2 — FLIPPED mode convention, on the cylinder's preserving sew: the oracle CATCHES it [${m2.legs.join(', ')}]`, m2.caught);
check('…and the flip is a REAL topological corruption, not a labeling: the mutant\'s "preserving" complex certifies w₁=1 (the Klein where the torus belongs)',
  /w₁=1/.test(m2.corruption));
note(`flipped-convention mutant: ${m2.corruption} (truth: w₁=0)`);

// (3) PATH-2 — declared classes NOT merged (G2: identify MEANS merge)
const m3 = mutantCase('path2',
  [
    { find: '    if (mergedIdOfB.has(edge.id)) continue; // absorbed into its declared partner\'s class', replace: '    // MUTANT path-2: the b-side class is KEPT (endpoints merge, classes do not)', count: 1 },
    { find: '    const id = mergedId ?? edge.id;', replace: '    const id = edge.id;', count: 1 },
    { find: '      if (mergedIdOfA.has(slot.edge)) return { edge: mergedIdOfA.get(slot.edge) as string, dir: slot.dir };', replace: '      if (false) return { edge: mergedIdOfA.get(slot.edge) as string, dir: slot.dir };', count: 1 },
    { find: '      if (mergedIdOfB.has(slot.edge)) {', replace: '      if (false) {', count: 1 },
  ],
  cylinderCase, ['edge-partition', 'counts']);
check(`mutation 3 — PATH-2 (endpoints merged, classes kept — NOT identification): the oracle CATCHES it [${m3.legs.join(', ')}]`, m3.caught);
note(`path-2 mutant: ${m3.corruption} (truth: χ=0; the un-deduplicated classes betray it — E stays 36 where the quotient has 32. On this fixture even χ moves; the ADR's warning is that on OTHERS it may not — hence the byte-structure witness)`);

// (4) face cycles NOT rewritten through resultOf (the D3 defect, shape layer)
const m4 = mutantCase('noRewrite',
  [{ find: '    vertexIds: face.vertexIds.map((vertexId) => resultOf(vertexId)),', replace: '    vertexIds: [...face.vertexIds],', count: 1 }],
  cylinderCase, ['shape-cycles', 'vertex-partition']);
check(`mutation 4 — born face cycles NOT rewritten through resultOf (D3, one layer down): the oracle CATCHES it [${m4.legs.join(', ')}]`, m4.caught);

// (5) ledger seeded wrong — pull-back membership corrupted (G4)
const m5 = mutantCase('ledgerSeed',
  [{ find: '  const ledger = buildLedgerFromIdentification([...complex.vertices], resultOf);', replace: '  const ledger = buildLedgerFromIdentification([...complex.vertices].slice(1), resultOf);', count: 1 }],
  cylinderCase, ['ledger']);
check(`mutation 5 — LEDGER mis-seeded (a source site dropped): the oracle CATCHES it [${m5.legs.join(', ')}]`, m5.caught);
check('CLAUSE 2 holds: all five distinct mutations are VISIBLY caught — the oracle is a witness, not an echo (a single uncaught mutation would have VOIDED it)',
  [m1, m2, m3, m4, m5].every((m) => m.caught));

// ═════ [g] the engine is untouched; the guards keep their teeth ══════════════
console.log('\n----- [g] no-regression: the oracle lives HERE; the engine is byte-unchanged -----');
const crStrip = (s) => s.replace(/\r/g, '');
const headContentOf = (file) =>
  execSync(`git show HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
// complexIdentification carries ONLY the §7-sanctioned DELEGATION-TRUTH
// comments (mothership-ruled): the TRANSPILED JS — comments stripped
// (`removeComments: true`; the default transpile PRESERVES them, which this
// guard itself caught on its first run) — must be byte-identical to HEAD's,
// proving the edit is comment-only, zero behavior.
const transpiled = (source) =>
  ts.transpileModule(crStrip(source), {
    compilerOptions: { ...TRANSPILE_OPTIONS.compilerOptions, removeComments: true },
    fileName: 'ci.ts',
  }).outputText;
const ciHeadSource = headContentOf('src/lib/complexIdentification.ts');
check('complexIdentification.ts: the §7 delegation-truth pin is COMMENT-ONLY — the transpiled JS (comments stripped) is byte-identical to HEAD\'s',
  transpiled(fs.readFileSync(ciPath, 'utf8')) === transpiled(ciHeadSource));
check('…and the transpile-identity guard BITES on code while forgiving comments: a one-token in-memory CODE edit changes the transpiled JS; a pure comment edit does not',
  transpiled(ciHeadSource.replace('cycleA.length !== cycleB.length', 'cycleA.length === cycleB.length')) !== transpiled(ciHeadSource) &&
  transpiled(`// bite-test comment\n${ciHeadSource}`) === transpiled(ciHeadSource));
const guarded = [
  'src/lib/surfaceOperations.ts',
  'src/lib/materializeOperation.ts',
  'src/lib/transformationLedger.ts',
  'src/lib/incidenceTraceRegistry.ts',
  'src/lib/globalW1.ts',
  'src/lib/multiform.ts',
  'src/lib/connectedSum.ts',
  'src/lib/cutOperation.ts',
  'src/lib/surfaceImmersion.ts',
  'src/playground/customGluing.ts',
  'src/playground/bornFormRouting.ts',
  'src/playground/playgroundOperations.ts',
  'src/playground/formInvariants.ts',
  'src/playground/snapshot.ts',
  'src/manuscript/surfaceClassifier.ts',
  'src/manuscript/inkedFormModel.ts',
  'src/manuscript/optionBModel.ts',
];
let dirty = [];
try {
  for (const file of guarded) {
    if (crStrip(headContentOf(file)) !== crStrip(fs.readFileSync(path.join(repoRoot, file), 'utf8'))) dirty.push(file);
  }
} catch (e) {
  dirty = [`guard failed to read: ${e.message}`];
}
check('everything else the battery runs through — ops · materializer · certifiers · classifiers · registry · gate · ledger — byte-unchanged vs HEAD, CR-insensitively',
  dirty.length === 0);
if (dirty.length) note(`dirty: ${dirty.join(', ')}`);
// THE GUARD STILL BITES (the mandated self-test — do not neuter):
const sentinel = 'src/lib/incidenceTraceRegistry.ts';
const sentinelHead = crStrip(headContentOf(sentinel));
const mutated = sentinelHead.slice(0, 100) + (sentinelHead[100] === 'X' ? 'Y' : 'X') + sentinelHead.slice(101);
check('the byte-guard still BITES on a genuine one-character in-memory edit — and the true content passes even CRLF-re-expressed',
  guarded.includes(sentinel) &&
  crStrip(mutated) !== sentinelHead &&
  crStrip(sentinelHead.replace(/\n/g, '\r\n')) === sentinelHead &&
  crStrip(fs.readFileSync(path.join(repoRoot, sentinel), 'utf8')) === sentinelHead);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

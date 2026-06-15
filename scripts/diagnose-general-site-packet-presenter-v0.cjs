#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
// Requiring the real presenter module is the mock-solution guard: delete
// generalSitePacketPresenterV0.ts and this require throws.
const {
  buildGeneralSitePacketPresenterReport,
  renderPacketFace,
} = require(path.join(repoRoot, 'src/lib/generalSitePacketPresenterV0.ts'));
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection, canApplyAmboDissection } = require(
  path.join(repoRoot, 'src/lib/ambo.ts'),
);

// Independent blocklist floor: re-declared here (NOT imported) — none of these
// may appear in any rendered face.
const FACE_BLOCKLIST = [
  'not-',
  'candidate-',
  '-status',
  'reasoningsource',
  'agentcomputation',
  'packetwritestatus',
  'shapemutation',
  'namingauthority',
  'labelstatus',
  'semanticstatus',
  'untested',
  'methodid',
  'scope',
  'siteid',
  'm_',
  'oppositemidpointid',
  'oppositeedgeid',
  'genealogy',
  'createdby',
  'sourcevertexids',
  'generationdepth',
  'field',
  'fieldcue',
  'tuple',
  'source-state',
  'source-signature',
  'pressure',
  'carrier',
  'octonion',
  'fano',
  'quark',
  'propagation',
  'atlas',
  'holonomy',
  'moufang',
  '∧',
];

let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}

function sortedJoin(values) {
  return [...values].sort().join(',');
}

// The site identity by label: the two parent labels, sorted and joined.
function siteKey(packet) {
  return [...packet.face.bornBetween].sort().join('');
}

function acrossLabels(packet) {
  return packet.face.namedNeighbours
    .filter((neighbour) => neighbour.role === 'across-cell')
    .map((neighbour) => neighbour.label);
}

function complementSize(packet) {
  return packet.trace.complementVertexIds.length;
}

function allFacesText(report) {
  return report.packets.map((packet) => renderPacketFace(packet).join('\n')).join('\n');
}

function hostCheck(name, report, shape) {
  const parentCells = shape.cells.filter((cell) => cell.kind === 'parent');
  let ok = 0;
  for (const packet of report.packets) {
    const vertex = shape.vertices[packet.trace.siteId];
    const parents = vertex.createdBy.sourceVertexIds;
    const edgeHosts = parentCells.filter((cell) =>
      cell.sourceEdgeIds.includes(vertex.createdBy.sourceEdgeId),
    );
    const independent = edgeHosts.length === 1 ? edgeHosts[0] : null;
    const host = shape.cells.find((cell) => cell.id === packet.trace.hostCellId);
    const sound =
      independent &&
      host &&
      independent.id === packet.trace.hostCellId &&
      parents.every((p) => host.sourceVertexIds.includes(p)) &&
      JSON.stringify([...packet.trace.complementVertexIds].sort()) ===
        JSON.stringify(host.sourceVertexIds.filter((id) => !parents.includes(id)).sort());
    if (sound) ok += 1;
  }
  check(
    `${name}. host = unique edge-match, contains both parents, complement = host minus parents (${ok}/${report.packets.length})`,
    ok === report.packets.length,
  );
}

function structuralConsistency(name, report, shape) {
  check(
    `${name}. every face: bornBetween=2, namedNeighbours = 2 parents + complement`,
    report.packets.every((packet) => {
      const parents = packet.face.namedNeighbours.filter((n) => n.role === 'parent').length;
      const across = packet.face.namedNeighbours.filter((n) => n.role === 'across-cell').length;

      return (
        packet.face.bornBetween.length === 2 &&
        parents === 2 &&
        across === complementSize(packet)
      );
    }),
  );
  check(
    `${name}. site label === recursive concat of parent labels (bornBetween joined)`,
    report.packets.every(
      (packet) =>
        shape.vertices[packet.trace.siteId].data.label === packet.face.bornBetween.join(''),
    ),
  );
  check(
    `${name}. trace.operation === 'ambo-dissection' & generationDepth >= 1`,
    report.packets.every(
      (packet) =>
        packet.trace.operation === 'ambo-dissection' && packet.trace.generationDepth >= 1,
    ),
  );
}

function faceDiscipline(name, report, requiredLabels) {
  const allFaces = allFacesText(report);
  const lowerFaces = allFaces.toLowerCase();
  const leaked = FACE_BLOCKLIST.filter((token) => lowerFaces.includes(token));

  check(
    `${name}. faces contain no blocklisted machinery (${leaked.length ? 'leaked: ' + leaked.join(', ') : 'clean'})`,
    leaked.length === 0,
  );
  check(
    `${name}. faces still carry the live concept labels (${requiredLabels.join(',')})`,
    requiredLabels.every((label) => allFaces.includes(label)),
  );
  check(
    `${name}. every namingDecision === null`,
    report.packets.every((packet) => packet.face.namingDecision === null),
  );
  check(
    `${name}. report exposes no scope-lock field (keys exactly methodId/seedKey/generatedSiteCount/packets/issues)`,
    !('scope' in report) &&
      JSON.stringify(Object.keys(report).sort()) ===
        JSON.stringify(['generatedSiteCount', 'issues', 'methodId', 'packets', 'seedKey']),
  );
  check(`${name}. report.issues empty`, report.issues.length === 0);
}

console.log('GeneralSitePacketPresenterV0 diagnostics');
console.log('');

// ===========================================================================
// FIXTURE A — tetrahedron gen-1
// ===========================================================================
const shapeA = applyAmboDissection(createSeedShape('tetrahedron'));
const reportA = buildGeneralSitePacketPresenterReport(shapeA);

console.log(`FIXTURE A (tetra gen-1) issues: ${reportA.issues.length}`);
for (const issue of reportA.issues) {
  console.log(`  ! ${issue}`);
}

check('A. generatedSiteCount === 6', reportA.generatedSiteCount === 6);
check('A. exactly 6 packets', reportA.packets.length === 6);
check('A. seedKey === tetrahedron', reportA.seedKey === 'tetrahedron');
check(
  'A. every complement size === 2',
  reportA.packets.every((packet) => complementSize(packet) === 2),
);
check(
  'A. every generationDepth === 1',
  reportA.packets.every((packet) => packet.trace.generationDepth === 1),
);
check(
  'A. sites by label === {AB,AC,AD,BC,BD,CD}',
  JSON.stringify(reportA.packets.map(siteKey).sort()) ===
    JSON.stringify(['AB', 'AC', 'AD', 'BC', 'BD', 'CD']),
);
const siteABm = reportA.packets.find((packet) => siteKey(packet) === 'AB');
const siteCDm = reportA.packets.find((packet) => siteKey(packet) === 'CD');
check('A. AB → complement {C,D}', Boolean(siteABm) && sortedJoin(acrossLabels(siteABm)) === 'C,D');
check('A. CD → complement {A,B}', Boolean(siteCDm) && sortedJoin(acrossLabels(siteCDm)) === 'A,B');
structuralConsistency('A', reportA, shapeA);
hostCheck('A', reportA, shapeA);
faceDiscipline('A', reportA, ['A', 'B', 'C', 'D']);

// ===========================================================================
// FIXTURE B — tetrahedron gen-2 (dissect the gen-1 octahedron core)
// ===========================================================================
const shapeA2 = applyAmboDissection(createSeedShape('tetrahedron'));
const coreCell = shapeA2.cells.find((cell) => cell.kind === 'core');
check('B. gen-1 core cell present', Boolean(coreCell));
check('B. core is dissectable', Boolean(coreCell) && canApplyAmboDissection(shapeA2, coreCell.id));
check('B. core topology === octahedron', Boolean(coreCell) && coreCell.topology === 'octahedron');
const shapeB = applyAmboDissection(shapeA2, coreCell.id);
const reportB = buildGeneralSitePacketPresenterReport(shapeB);

console.log('');
console.log(`FIXTURE B (tetra gen-2) issues: ${reportB.issues.length}`);
for (const issue of reportB.issues) {
  console.log(`  ! ${issue}`);
}

check('B. generatedSiteCount === 18', reportB.generatedSiteCount === 18);
check('B. exactly 18 packets (all generations shown)', reportB.packets.length === 18);
check('B. seedKey === tetrahedron', reportB.seedKey === 'tetrahedron');
const depth1B = reportB.packets.filter((packet) => packet.trace.generationDepth === 1);
const depth2B = reportB.packets.filter((packet) => packet.trace.generationDepth === 2);
check('B. exactly 6 sites at depth 1', depth1B.length === 6);
check('B. exactly 12 sites at depth 2', depth2B.length === 12);
check(
  'B. depth-1 sites complement size === 2 (host = preserved seed parent)',
  depth1B.length === 6 && depth1B.every((packet) => complementSize(packet) === 2),
);
check(
  'B. depth-2 sites complement size === 4',
  depth2B.length === 12 && depth2B.every((packet) => complementSize(packet) === 4),
);
const childABAC = depth2B.find((packet) => siteKey(packet) === 'ABAC');
check('B. child {AB,AC} present at depth 2', Boolean(childABAC));
check(
  'B. child {AB,AC} complement === {AD,BC,BD,CD}',
  Boolean(childABAC) && sortedJoin(acrossLabels(childABAC)) === 'AD,BC,BD,CD',
);
structuralConsistency('B', reportB, shapeB);
hostCheck('B', reportB, shapeB);
faceDiscipline('B', reportB, ['A', 'B', 'C', 'D']);

// ===========================================================================
// FIXTURE C — octahedron gen-1
// ===========================================================================
const shapeC = applyAmboDissection(createSeedShape('octahedron'));
const reportC = buildGeneralSitePacketPresenterReport(shapeC);

console.log('');
console.log(`FIXTURE C (octa gen-1) issues: ${reportC.issues.length}`);
for (const issue of reportC.issues) {
  console.log(`  ! ${issue}`);
}

check('C. generatedSiteCount === 12', reportC.generatedSiteCount === 12);
check('C. exactly 12 packets', reportC.packets.length === 12);
check('C. seedKey === octahedron', reportC.seedKey === 'octahedron');
check(
  'C. every complement size === 4',
  reportC.packets.every((packet) => complementSize(packet) === 4),
);
check(
  'C. every generationDepth === 1',
  reportC.packets.every((packet) => packet.trace.generationDepth === 1),
);
structuralConsistency('C', reportC, shapeC);
hostCheck('C', reportC, shapeC);
faceDiscipline('C', reportC, ['+X', '-X', '+Y', '-Y', '+Z', '-Z']);

// ===========================================================================
// FIXTURE D — cube gen-1
// ===========================================================================
const shapeD = applyAmboDissection(createSeedShape('cube'));
const reportD = buildGeneralSitePacketPresenterReport(shapeD);

console.log('');
console.log(`FIXTURE D (cube gen-1) issues: ${reportD.issues.length}`);
for (const issue of reportD.issues) {
  console.log(`  ! ${issue}`);
}

check('D. generatedSiteCount === 12', reportD.generatedSiteCount === 12);
check('D. exactly 12 packets', reportD.packets.length === 12);
check('D. seedKey === cube', reportD.seedKey === 'cube');
check(
  'D. every complement size === 6',
  reportD.packets.every((packet) => complementSize(packet) === 6),
);
check(
  'D. every generationDepth === 1',
  reportD.packets.every((packet) => packet.trace.generationDepth === 1),
);
structuralConsistency('D', reportD, shapeD);
hostCheck('D', reportD, shapeD);
faceDiscipline('D', reportD, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

// ===== M6 — depth / portability confidence (deeper generations + varied shapes) =====
// E — tetra gen-3 (seed -> octahedron core -> cuboctahedron core)
const e1 = applyAmboDissection(createSeedShape('tetrahedron'));
const e2 = applyAmboDissection(e1, e1.cells.find((c) => c.kind === 'core').id);
const eCore2 = e2.cells.find((c) => c.kind === 'core');
check('E. gen-2 core is cuboctahedron', Boolean(eCore2) && eCore2.topology === 'cuboctahedron');
const shapeE = applyAmboDissection(e2, eCore2.id);
const reportE = buildGeneralSitePacketPresenterReport(shapeE);
console.log(`\nFIXTURE E (tetra gen-3) issues: ${reportE.issues.length}`);
reportE.issues.forEach((i) => console.log(`  ! ${i}`));
check('E. generatedSiteCount === 42 / 42 packets / issues 0',
  reportE.generatedSiteCount === 42 && reportE.packets.length === 42 && reportE.issues.length === 0);
{ const d = (n) => reportE.packets.filter((p) => p.trace.generationDepth === n).length;
  const cs = (n) => reportE.packets.filter((p) => p.trace.complementVertexIds.length === n).length;
  check('E. depths 6/12/24', d(1) === 6 && d(2) === 12 && d(3) === 24);
  check('E. complement sizes 2/4/10 = 6/12/24', cs(2) === 6 && cs(4) === 12 && cs(10) === 24); }
structuralConsistency('E', reportE, shapeE); hostCheck('E', reportE, shapeE);
faceDiscipline('E', reportE, ['A', 'B', 'C', 'D']);

// F — MULTI-DISSECTION (seed + core + a sibling residue): the case the old gate mis-resolved.
const f1 = applyAmboDissection(createSeedShape('tetrahedron'));
const f2 = applyAmboDissection(f1, f1.cells.find((c) => c.kind === 'core').id);
const shapeF = applyAmboDissection(f2, f1.cells.find((c) => c.kind === 'residue').id);
const reportF = buildGeneralSitePacketPresenterReport(shapeF);
console.log(`\nFIXTURE F (multi-dissection) issues: ${reportF.issues.length}`);
reportF.issues.forEach((i) => console.log(`  ! ${i}`));
check('F. three parent cells', shapeF.cells.filter((c) => c.kind === 'parent').length === 3);
check('F. 24 sites / 24 packets / ZERO unsupported (the fix)',
  reportF.generatedSiteCount === 24 && reportF.packets.length === 24 && reportF.issues.length === 0);
{ const d = (n) => reportF.packets.filter((p) => p.trace.generationDepth === n).length;
  const cs = (n) => reportF.packets.filter((p) => p.trace.complementVertexIds.length === n).length;
  check('F. depths 6/18', d(1) === 6 && d(2) === 18);
  check('F. complement sizes 2/4 = 12/12', cs(2) === 12 && cs(4) === 12); }
structuralConsistency('F', reportF, shapeF); hostCheck('F', reportF, shapeF);
faceDiscipline('F', reportF, ['A', 'B', 'C', 'D']);

// G — octahedron gen-2 ; H — cube gen-2 (different seeds, deeper)
const shapeG = (() => { const g = applyAmboDissection(createSeedShape('octahedron'));
  return applyAmboDissection(g, g.cells.find((c) => c.kind === 'core').id); })();
const reportG = buildGeneralSitePacketPresenterReport(shapeG);
check('G. octa gen-2: 36 sites, issues 0', reportG.generatedSiteCount === 36 && reportG.issues.length === 0);
{ const cs = (n) => reportG.packets.filter((p) => p.trace.complementVertexIds.length === n).length;
  check('G. complement sizes 4/10 = 12/24', cs(4) === 12 && cs(10) === 24); }
hostCheck('G', reportG, shapeG); faceDiscipline('G', reportG, ['+X', '-X', '+Y', '-Y', '+Z', '-Z']);

const shapeH = (() => { const h = applyAmboDissection(createSeedShape('cube'));
  return applyAmboDissection(h, h.cells.find((c) => c.kind === 'core').id); })();
const reportH = buildGeneralSitePacketPresenterReport(shapeH);
check('H. cube gen-2: 36 sites, issues 0', reportH.generatedSiteCount === 36 && reportH.issues.length === 0);
{ const cs = (n) => reportH.packets.filter((p) => p.trace.complementVertexIds.length === n).length;
  check('H. complement sizes 6/10 = 12/24', cs(6) === 12 && cs(10) === 24); }
hostCheck('H', reportH, shapeH); faceDiscipline('H', reportH, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

// I — square-pyramid family (dissect an octahedron residue -> complement size 3)
const i1 = applyAmboDissection(createSeedShape('octahedron'));
const iRes = i1.cells.find((c) => c.kind === 'residue');
check('I. octa residue is a square-pyramid', Boolean(iRes) && iRes.topology === 'square-pyramid');
const shapeI = applyAmboDissection(i1, iRes.id);
const reportI = buildGeneralSitePacketPresenterReport(shapeI);
check('I. 20 sites, issues 0', reportI.generatedSiteCount === 20 && reportI.issues.length === 0);
{ const cs = (n) => reportI.packets.filter((p) => p.trace.complementVertexIds.length === n).length;
  check('I. complement sizes 4/3 = 12/8', cs(4) === 12 && cs(3) === 8); }
hostCheck('I', reportI, shapeI); faceDiscipline('I', reportI, ['+X', '-X', '+Y', '-Y', '+Z', '-Z']);

// ===========================================================================
// Eyeball: one seed/gen-neutral face from A, one from B (a gen-2 face).
// ===========================================================================
console.log('');
console.log('--- FIXTURE A: one rendered face (gen-1, complement of 2) ---');
for (const line of renderPacketFace(reportA.packets[0])) {
  console.log(line);
}
console.log('--- end ---');
console.log('');
console.log('--- FIXTURE B: one rendered face (gen-2, complement of 4) ---');
const faceBshowcase = childABAC ?? depth2B[0] ?? reportB.packets[0];
for (const line of renderPacketFace(faceBshowcase)) {
  console.log(line);
}
console.log('--- end ---');

console.log('');
if (failures === 0) {
  console.log('GeneralSitePacketPresenterV0 diagnostics passed.');
  process.exit(0);
} else {
  console.error(
    `GeneralSitePacketPresenterV0 diagnostics failed: ${failures} assert(s).`,
  );
  process.exit(1);
}

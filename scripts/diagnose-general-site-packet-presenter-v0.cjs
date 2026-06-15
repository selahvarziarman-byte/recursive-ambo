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

// Independent host resolver — re-derives the host cell straight from the engine,
// to cross-check the presenter's trace.hostCellId. Returns the edge-match id and
// the vertex-containment id (smallest sourceVertexIds first); they must agree.
function independentHostIds(shape, vertex) {
  const parents = vertex.createdBy.sourceVertexIds;
  const sourceEdgeId = vertex.createdBy.sourceEdgeId;
  const parentCells = shape.cells.filter((cell) => cell.kind === 'parent');
  const edgeHosts = parentCells.filter((cell) => cell.sourceEdgeIds.includes(sourceEdgeId));
  const vertexHosts = parentCells
    .filter((cell) => parents.every((parent) => cell.sourceVertexIds.includes(parent)))
    .sort(
      (a, b) =>
        a.sourceVertexIds.length - b.sourceVertexIds.length || a.id.localeCompare(b.id),
    );

  return {
    edgeId: edgeHosts.length === 1 ? edgeHosts[0].id : null,
    vertexId: vertexHosts[0] ? vertexHosts[0].id : null,
  };
}

function hostCrossCheck(name, report, shape) {
  let agree = 0;

  for (const packet of report.packets) {
    const vertex = shape.vertices[packet.trace.siteId];
    const { edgeId, vertexId } = independentHostIds(shape, vertex);

    if (edgeId !== null && edgeId === vertexId && edgeId === packet.trace.hostCellId) {
      agree += 1;
    }
  }

  check(
    `${name}. host edge-match === vertex-containment === trace.hostCellId for all ${report.packets.length} sites`,
    agree === report.packets.length,
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
    `${name}. report carries no 'one-ambo-tetrahedron-only' scope string`,
    !JSON.stringify(report).includes('one-ambo-tetrahedron-only'),
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
hostCrossCheck('A', reportA, shapeA);
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
hostCrossCheck('B', reportB, shapeB);
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
hostCrossCheck('C', reportC, shapeC);
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
hostCrossCheck('D', reportD, shapeD);
faceDiscipline('D', reportD, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

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

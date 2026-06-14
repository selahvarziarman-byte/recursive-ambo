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
// Requiring the real module is the mock-solution guard: delete
// generatedSitePacketV0.ts and this require throws.
const {
  buildGeneratedSitePacketV0Report,
  renderPacketFace,
} = require(path.join(repoRoot, 'src/lib/generatedSitePacketV0.ts'));
const { buildGeneratedSiteTrisonTriadV0Report } = require(
  path.join(repoRoot, 'src/lib/generatedSiteTrisonTriadV0.ts'),
);

// Hard-constraint blocklist: none of these may appear in the face.
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

const report = buildGeneratedSitePacketV0Report();
const triadReport = buildGeneratedSiteTrisonTriadV0Report();
const triadBySiteId = new Map(
  triadReport.triads.map((triad) => [triad.siteId, triad]),
);

console.log('GeneratedSitePacketV0 diagnostics (minimal face)');
console.log(`issues: ${report.issues.length}`);
for (const issue of report.issues) {
  console.log(`  ! ${issue}`);
}
console.log('');
console.log('--- one rendered minimal face (audit can eyeball it) ---');
for (const line of renderPacketFace(report.packets[0])) {
  console.log(line);
}
console.log('--- end rendered face ---');
console.log('');

// Assert 1 — exactly 6 packets; parents / opposite axis match Pkt-2's triads.
check('1. exactly 6 packets', report.packets.length === 6);
for (const packet of report.packets) {
  const triad = triadBySiteId.get(packet.trace.siteId);
  check(`1. ${packet.trace.siteId} matches a Pkt-2 triad`, Boolean(triad));

  if (triad) {
    check(
      `1. ${packet.trace.siteId} bornBetween = triad parents`,
      sortedJoin(packet.face.bornBetween) ===
        sortedJoin([triad.parentA.label, triad.parentB.label]),
    );
    const oppositeAxisLabels = packet.face.namedNeighbours
      .filter((neighbour) => neighbour.role === 'opposite-axis')
      .map((neighbour) => neighbour.label);
    check(
      `1. ${packet.trace.siteId} opposite-axis = triad J components`,
      sortedJoin(oppositeAxisLabels) ===
        sortedJoin(triad.sublatedJ.components.map((c) => c.label)),
    );
  }
}

// Assert 2 — minimal face shape: locator fields present; excavation apparatus gone.
for (const packet of report.packets) {
  const face = packet.face;
  const parentNeighbours = face.namedNeighbours.filter(
    (neighbour) => neighbour.role === 'parent',
  );
  const oppositeNeighbours = face.namedNeighbours.filter(
    (neighbour) => neighbour.role === 'opposite-axis',
  );

  check(
    `2. ${packet.trace.siteId} locator fields present`,
    typeof face.siteDescription === 'string' &&
      face.siteDescription.length > 0 &&
      typeof face.readAcross === 'string' &&
      face.readAcross.length > 0 &&
      typeof face.howToName === 'string' &&
      face.howToName.length > 0,
  );
  check(
    `2. ${packet.trace.siteId} bornBetween has 2 parents`,
    face.bornBetween.length === 2,
  );
  check(
    `2. ${packet.trace.siteId} namedNeighbours = 2 parents + 2 opposite`,
    face.namedNeighbours.length === 4 &&
      parentNeighbours.length === 2 &&
      oppositeNeighbours.length === 2,
  );
  check(
    `2. ${packet.trace.siteId} excavation apparatus removed`,
    !('excavation' in face) && !('judgeYourCandidate' in face),
  );
  check(
    `2. ${packet.trace.siteId} namingDecision === null`,
    face.namingDecision === null,
  );
}

// Assert 3 — THE HARD-CONSTRAINT TEST: rendered faces carry no machinery, but
// still carry the live concept labels.
const allFaces = report.packets
  .map((packet) => renderPacketFace(packet).join('\n'))
  .join('\n');
const lowerFaces = allFaces.toLowerCase();
const leaked = FACE_BLOCKLIST.filter((token) => lowerFaces.includes(token));
check(
  `3. faces contain no blocklisted machinery (${leaked.length ? 'leaked: ' + leaked.join(', ') : 'clean'})`,
  leaked.length === 0,
);
check(
  '3. faces still carry the live concept labels A/B/C/D',
  ['A', 'B', 'C', 'D'].every((label) => allFaces.includes(label)),
);

// Assert 4 — the trace DOES carry the machinery (ids preserved, off the face).
const realSiteIds = triadReport.triads.map((triad) => triad.siteId).sort();
const traceSiteIds = report.packets.map((packet) => packet.trace.siteId).sort();
check(
  '4. trace siteIds === real generated-site set',
  JSON.stringify(traceSiteIds) === JSON.stringify(realSiteIds),
);
check(
  '4. every trace carries parentIds + opposite ids',
  report.packets.every(
    (packet) =>
      packet.trace.parentIds.length === 2 &&
      packet.trace.oppositeMidpointId.startsWith('M_') &&
      packet.trace.oppositeEdgeId.length === 2 &&
      packet.trace.operation === 'ambo' &&
      packet.trace.generation === 1 &&
      packet.trace.seed === 'tetrahedron',
  ),
);
const packetAB = report.packets.find(
  (packet) => packet.trace.siteId === 'M_AB',
);
check(
  '4. M_AB trace opposite midpoint === M_CD',
  Boolean(packetAB) && packetAB.trace.oppositeMidpointId === 'M_CD',
);

// Assert 5 — methodId / scope exact; report.issues empty.
check('5. methodId exact', report.methodId === 'generated-site-packet-v0');
check('5. scope exact', report.scope === 'one-ambo-tetrahedron-only');
check('5. report.issues empty', report.issues.length === 0);

console.log('');
if (failures === 0) {
  console.log('GeneratedSitePacketV0 diagnostics passed.');
  process.exit(0);
} else {
  console.error(
    `GeneratedSitePacketV0 diagnostics failed: ${failures} assert(s).`,
  );
  process.exit(1);
}

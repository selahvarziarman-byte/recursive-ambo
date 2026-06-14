// generatedSitePacketV0 — the per-site packet: a minimal human FACE + a
// walled-off TRACE.
//
// Per one-Ambo tetrahedron generated site, assembles ONE packet:
//   - a minimal human FACE: a structural locator (where the site sits, who its
//     named neighbours are) + a naming slot. It poses as NO semantic help.
//   - a subordinate, walled-off TRACE: ids/lineage for downstream traceability.
//
// Refined CAL-2 (mothership-ratified): the excavation / Trisonized-Midwife path
// is DROPPED from the human face. The system is a non-reasoning frame-filler;
// placeholders + a non-reasoning system can only yield generic templates, and
// prose dressing re-creates the templates-as-product failure. So the face is the
// minimal structural locator only; the human is the sole namer/signer.
//
// FACE rules (still enforced): state by structure, not by caveat ("Unnamed" =
// the naming slot is null, never a status label); no coded ids in the face (they
// live only in the TRACE); no dead-campaign vocabulary. A blocklist self-check
// guards this; the diagnostic enforces it independently.
//
// Built from Pkt-2 (the triad) ONLY. trisonizedMidwifeReadingV0.ts remains in the
// repo as the standalone method artifact but is no longer used here. In-memory
// report object — no persistence, no Shape mutation, no auto-naming.

import {
  buildGeneratedSiteTrisonTriadV0Report,
  type GeneratedSiteTrisonTriadV0,
} from './generatedSiteTrisonTriadV0';

export interface PacketNamedNeighbour {
  label: string;
  role: 'parent' | 'opposite-axis';
}

export interface PacketNamingDecision {
  name: string;
  reasoning: string;
}

export interface GeneratedSitePacketFaceV0 {
  siteDescription: string;
  bornBetween: [string, string];
  readAcross: string;
  namedNeighbours: PacketNamedNeighbour[];
  howToName: string;
  namingDecision: PacketNamingDecision | null;
}

export interface GeneratedSitePacketTraceV0 {
  siteId: string;
  parentIds: [string, string];
  oppositeEdgeId: string;
  oppositeMidpointId: string;
  generation: number;
  operation: 'ambo';
  seed: 'tetrahedron';
}

export interface GeneratedSitePacketV0 {
  face: GeneratedSitePacketFaceV0;
  trace: GeneratedSitePacketTraceV0;
}

export interface GeneratedSitePacketV0Report {
  methodId: 'generated-site-packet-v0';
  scope: 'one-ambo-tetrahedron-only';
  packets: GeneratedSitePacketV0[];
  issues: string[];
}

// Tokens that must NEVER appear in the rendered face. Module self-check; the
// diagnostic enforces the same floor independently.
const FACE_FORBIDDEN_TOKENS: string[] = [
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

function buildFace(triad: GeneratedSiteTrisonTriadV0): GeneratedSitePacketFaceV0 {
  const parentALabel = triad.parentA.label;
  const parentBLabel = triad.parentB.label;
  const [oppositeC, oppositeD] = triad.sublatedJ.components;
  const oppositeCLabel = oppositeC.label;
  const oppositeDLabel = oppositeD.label;

  return {
    siteDescription: `A new site born where the edge between ${parentALabel} and ${parentBLabel} is rectified — the first Ambo of the tetrahedron.`,
    bornBetween: [parentALabel, parentBLabel],
    readAcross: `The opposite pairing is ${oppositeCLabel} and ${oppositeDLabel}.`,
    namedNeighbours: [
      { label: parentALabel, role: 'parent' },
      { label: parentBLabel, role: 'parent' },
      { label: oppositeCLabel, role: 'opposite-axis' },
      { label: oppositeDLabel, role: 'opposite-axis' },
    ],
    howToName: 'Name the concept that dwells here.',
    namingDecision: null,
  };
}

function buildTrace(
  triad: GeneratedSiteTrisonTriadV0,
): GeneratedSitePacketTraceV0 {
  return {
    siteId: triad.siteId,
    parentIds: [triad.parentA.id, triad.parentB.id],
    oppositeEdgeId: triad.sublatedJ.oppositeEdgeId,
    oppositeMidpointId: triad.sublatedJ.oppositeMidpointId,
    generation: triad.provenance.generation,
    operation: 'ambo',
    seed: 'tetrahedron',
  };
}

function scanFaceForForbiddenTokens(packet: GeneratedSitePacketV0): string[] {
  const rendered = renderPacketFace(packet).join('\n').toLowerCase();

  return FACE_FORBIDDEN_TOKENS.filter((token) => rendered.includes(token));
}

export function buildGeneratedSitePacketV0Report(): GeneratedSitePacketV0Report {
  const issues: string[] = [];
  const triadReport = buildGeneratedSiteTrisonTriadV0Report();

  for (const issue of triadReport.issues) {
    issues.push(`pkt-2 triad: ${issue}`);
  }

  const packets: GeneratedSitePacketV0[] = triadReport.triads.map((triad) => ({
    face: buildFace(triad),
    trace: buildTrace(triad),
  }));

  if (packets.length !== 6) {
    issues.push(`expected 6 packets, derived ${packets.length}`);
  }

  for (const packet of packets) {
    if (packet.face.namedNeighbours.length !== 4) {
      issues.push(
        `packet ${packet.trace.siteId} face has ${packet.face.namedNeighbours.length} named neighbours, expected 4`,
      );
    }

    const leaks = scanFaceForForbiddenTokens(packet);

    if (leaks.length > 0) {
      issues.push(
        `packet ${packet.trace.siteId} face leaked machinery tokens: ${leaks.join(', ')}`,
      );
    }
  }

  return {
    methodId: 'generated-site-packet-v0',
    scope: 'one-ambo-tetrahedron-only',
    packets,
    issues,
  };
}

// CLEAN human worksheet — renders the minimal FACE only, never the trace.
export function renderPacketFace(packet: GeneratedSitePacketV0): string[] {
  const face = packet.face;
  const lines: string[] = [];

  lines.push(face.siteDescription);
  lines.push(`Born between ${face.bornBetween[0]} and ${face.bornBetween[1]}.`);
  lines.push(face.readAcross);
  lines.push('');
  lines.push('Named neighbours:');
  for (const neighbour of face.namedNeighbours) {
    const roleWords = neighbour.role === 'parent' ? 'parent' : 'opposite axis';
    lines.push(`  ${neighbour.label} (${roleWords})`);
  }
  lines.push('');
  lines.push(face.howToName);
  lines.push('');
  if (face.namingDecision === null) {
    lines.push('Name: ______________________________');
    lines.push('Why this name: ______________________________');
  } else {
    lines.push(`Name: ${face.namingDecision.name}`);
    lines.push(`Why this name: ${face.namingDecision.reasoning}`);
  }

  return lines;
}

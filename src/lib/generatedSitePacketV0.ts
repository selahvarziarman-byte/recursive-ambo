// generatedSitePacketV0 — the per-site packet, with a clean human FACE.
//
// Per one-Ambo tetrahedron generated site, assembles ONE packet:
//   - a human-readable FACE: the product a person reads to NAME the site;
//   - a subordinate, walled-off TRACE: ids/lineage for downstream traceability.
//
// THE HARD CONSTRAINT (mandate §2): the face carries MEANING, never machinery.
//   * State by structure, not by caveat. "Unnamed" = the naming slot is null —
//     never a status label.
//   * No coded ids in the face (no 'M_AB', vertex keys, oppositeMidpointId, …).
//     Plain concept labels (A, B, C, D) and plain prose only. Coded ids live in
//     the TRACE.
//   * No dead-campaign vocabulary (field, tuple, source-state, pressure, …).
//   * The Trison method's own notation (Ω, Λ, ⊕, ⊖, ↔; "radix completion / loop
//     horizon / residual") is MEANING and stays. Implementation hygiene, coded
//     ids, and dead-field words are stripped.
//
// Built from Pkt-2 (the triad) and Pkt-3 (the excavation frame) ONLY. No
// field-polluted imports. In-memory report object — no persistence, no Shape
// mutation, no auto-naming.

import {
  buildGeneratedSiteTrisonTriadV0Report,
  toTrisonFrameInput,
  type GeneratedSiteTrisonTriadV0,
} from './generatedSiteTrisonTriadV0';
import { buildTrisonizedMidwifeReadingFrameV0 } from './trisonizedMidwifeReadingV0';

export interface PacketNamedNeighbour {
  label: string;
  role: 'parent' | 'opposite-axis';
}

export interface PacketExcavationStep {
  question: string;
  guidance: string;
  note: string; // the Trison formula line (Ω_A = …)
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
  excavation: PacketExcavationStep[];
  judgeYourCandidate: string[];
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

// Tokens that must NEVER appear in the rendered face (mandate §2 / §5.3).
// Used for the module's own honesty self-check; the diagnostic enforces the
// same floor independently.
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

// Strip machinery from inherited Trison text while keeping the method's MEANING:
//   - render the combined-J label (e.g. 'C∧D') as plain words;
//   - drop the "(§…)" spec citations (hygiene, not naming help);
//   - drop the word "pressure" (dead-field vocabulary), preserving the sense.
function cleanForFace(text: string, jLabel: string, jWords: string): string {
  return text
    .split(jLabel)
    .join(jWords)
    .replace(/\s*\(§[^)]*\)/g, '')
    .replace(/fake naming pressure/gi, 'a forced name')
    .replace(/pressure/gi, 'fit')
    .trim();
}

function cleanRubricLine(line: string, jLabel: string, jWords: string): string {
  // Drop the leading "NN.N " section number so it reads as plain naming help.
  return cleanForFace(line.replace(/^\d+\.\d+\s+/, ''), jLabel, jWords);
}

function buildFace(triad: GeneratedSiteTrisonTriadV0): GeneratedSitePacketFaceV0 {
  const parentALabel = triad.parentA.label;
  const parentBLabel = triad.parentB.label;
  const [oppositeC, oppositeD] = triad.sublatedJ.components;
  const oppositeCLabel = oppositeC.label;
  const oppositeDLabel = oppositeD.label;
  const jLabel = triad.sublatedJ.label;
  const jWords = `the pairing of ${oppositeCLabel} and ${oppositeDLabel}`;

  const frame = buildTrisonizedMidwifeReadingFrameV0(toTrisonFrameInput(triad));
  const excavation: PacketExcavationStep[] = frame.slots.map((slot) => ({
    question: cleanForFace(slot.prompt, jLabel, jWords),
    guidance: cleanForFace(slot.guidance, jLabel, jWords),
    note: cleanForFace(slot.formula, jLabel, jWords),
  }));
  const judgeYourCandidate = frame.rubric.map((line) =>
    cleanRubricLine(line, jLabel, jWords),
  );

  return {
    siteDescription: `A new site born where the edge between ${parentALabel} and ${parentBLabel} is rectified — the first Ambo of the tetrahedron.`,
    bornBetween: [parentALabel, parentBLabel],
    readAcross: `Read across from the opposite pairing of ${oppositeCLabel} and ${oppositeDLabel}.`,
    namedNeighbours: [
      { label: parentALabel, role: 'parent' },
      { label: parentBLabel, role: 'parent' },
      { label: oppositeCLabel, role: 'opposite-axis' },
      { label: oppositeDLabel, role: 'opposite-axis' },
    ],
    howToName:
      'Answer the questions in order to find the concept that can dwell here.',
    excavation,
    judgeYourCandidate,
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
    if (packet.face.excavation.length !== 7) {
      issues.push(
        `packet ${packet.trace.siteId} face has ${packet.face.excavation.length} excavation steps, expected 7`,
      );
    }

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

// CLEAN human worksheet — renders the FACE only, never the trace.
export function renderPacketFace(packet: GeneratedSitePacketV0): string[] {
  const face = packet.face;
  const lines: string[] = [];

  lines.push(face.siteDescription);
  lines.push(`Born between ${face.bornBetween[0]} and ${face.bornBetween[1]}.`);
  lines.push(face.readAcross);
  lines.push('');
  lines.push('Named neighbours:');
  for (const neighbour of face.namedNeighbours) {
    const roleWords =
      neighbour.role === 'parent' ? 'parent' : 'opposite axis';
    lines.push(`  ${neighbour.label} (${roleWords})`);
  }
  lines.push('');
  lines.push(face.howToName);
  lines.push('');
  lines.push('Questions to work through, in order:');
  face.excavation.forEach((step, index) => {
    lines.push(`  ${index + 1}. ${step.question}`);
    lines.push(`     ${step.note}`);
    lines.push(`     ${step.guidance}`);
  });
  lines.push('');
  lines.push('Is your name a good fit? Check it against:');
  for (const criterion of face.judgeYourCandidate) {
    lines.push(`  - ${criterion}`);
  }
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

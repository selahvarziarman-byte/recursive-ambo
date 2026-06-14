// TrisonizedMidwifeReadingV0 — blank excavation-frame builder for semantic
// naming support at a generated edge-child site.
//
// Spec: docs/governance/PLATONIC_ENGINE_TRISONIZED_MIDWIFE_SEMANTIC_CLUEING_METHOD.md
// Binding law (minor-campaign map CAL-2): FRAME + QUESTIONS ONLY.
// This module interpolates the abstract triad (J; A, B) into the fixed §6
// questions and emits them as EMPTY, human-fill slots, together with the §10
// rubric and §15 acceptance criteria as guidance. The HUMAN performs all
// Ω_A / Ω_B / Λ / X / ρ / verdict reasoning. There is NO agent semantic
// reasoning here: where the spec's §8/§9 examples show an agent computing
// completions, CAL-2 overrides — this module computes nothing semantic.
//
// Scope: v0 is geometry-decoupled. The triad arrives as abstract string input;
// deriving (J; A, B) from a generated site is a separate later mandate. This
// module imports nothing from the repo.

export const TRISONIZED_MIDWIFE_METHOD_ID =
  'trisonized-midwife-semantic-clueing-v0' as const;

export type TrisonReasoningSource = 'human';
export type TrisonAgentComputation = 'frame-and-questions-only';
export type TrisonSemanticStatus = 'candidate-naming-pressure-not-final-name';
export type TrisonPacketWriteStatus = 'not-packet-writing';
export type TrisonShapeMutationStatus = 'not-shape-mutation';
export type TrisonNamingAuthority = 'human-names';
export type TrisonVerdict = 'accepted' | 'ambiguous' | 'unsupported';

export interface TrisonizedMidwifeTriadInputV0 {
  triadId: string;
  sublatedVertex: string /* J */;
  parentA: string;
  parentB: string;
  context?: string;
}

export type TrisonStepId =
  | 'radix-completion-A'
  | 'radix-completion-B'
  | 'completion-duality'
  | 'loop-horizon'
  | 'child'
  | 'residuals'
  | 'verdict';

export interface TrisonFrameSlotV0 {
  stepId: TrisonStepId;
  order: number; // 1..7 fixed
  prompt: string; // fixed §6 question, J/A/B interpolated
  formula: string; // e.g. 'Ω_A = J ⊕ A', interpolated
  answer: null; // EMPTY — human-filled later; NEVER computed here
  guidance: string; // §12 discipline note
}

export interface TrisonizedMidwifeReadingFrameV0 {
  methodId: typeof TRISONIZED_MIDWIFE_METHOD_ID;
  reasoningSource: TrisonReasoningSource; // 'human'
  agentComputation: TrisonAgentComputation; // 'frame-and-questions-only'
  input: TrisonizedMidwifeTriadInputV0;
  slots: TrisonFrameSlotV0[]; // exactly 7, fixed order
  rubric: string[]; // §10, 6 criteria
  acceptanceCriteria: string[]; // §15, 10 items
  semanticStatus: TrisonSemanticStatus;
  packetWriteStatus: TrisonPacketWriteStatus;
  shapeMutationStatus: TrisonShapeMutationStatus;
  namingAuthority: TrisonNamingAuthority;
}

// Fixed §6 frame specification. Prompts and formulas carry {J}/{A}/{B}
// placeholders interpolated at build time; the glyphs ⊕ ⊖ ↔ Ω Λ ρ and the
// step order are part of the discipline and are kept verbatim. The guidance is
// the §12 failure-mode note that protects each step.
interface TrisonFrameStepSpec {
  stepId: TrisonStepId;
  promptTemplate: string;
  formulaTemplate: string;
  guidance: string;
}

const TRISON_FRAME_STEP_SPECS: readonly TrisonFrameStepSpec[] = [
  {
    stepId: 'radix-completion-A',
    promptTemplate: 'What world/horizon appears when {J} completes with {A}?',
    formulaTemplate: 'Ω_A = {J} ⊕ {A}',
    guidance:
      'Search, do not guess. State the horizon J becomes with A as a meaningful phrase, not a vague association — a complement is undefined without its horizon Ω_A. (§12.1, §12.2)',
  },
  {
    stepId: 'radix-completion-B',
    promptTemplate: 'What world/horizon appears when {J} completes with {B}?',
    formulaTemplate: 'Ω_B = {J} ⊕ {B}',
    guidance:
      'Search, do not guess. State the horizon J becomes with B as a meaningful phrase, not a vague association — a complement is undefined without its horizon Ω_B. (§12.1, §12.2)',
  },
  {
    stepId: 'completion-duality',
    promptTemplate:
      'Ω_A ↔ Ω_B: shared axis? difference? what must be preserved from both?',
    formulaTemplate: 'Ω_A ↔ Ω_B',
    guidance:
      'Compare the two completions Ω_A ↔ Ω_B, not A versus B directly; name the shared axis, the difference, and what both must preserve. (§6.2)',
  },
  {
    stepId: 'loop-horizon',
    promptTemplate:
      'What smaller/operational/poietic horizon Λ preserves Ω_A ↔ Ω_B without becoming either?',
    formulaTemplate: 'Λ = {J} ⊕ X',
    guidance:
      'Λ is the world in which the child will function, derived from the duality before X is named; it is not the child with abstract suffixes. (§12.3)',
  },
  {
    stepId: 'child',
    promptTemplate: 'What concept X complements {J} into Λ?',
    formulaTemplate: 'X = Λ ⊖ {J}',
    guidance:
      'Do not guess X first. X is the loop-complement of J into Λ — not a blend, midpoint, or compromise of A and B, and not something derivable without J. (§12.4, §12.5)',
  },
  {
    stepId: 'residuals',
    promptTemplate: 'What do {A} and {B} still hold that X does not?',
    formulaTemplate: 'ρ_A = {A} ⊖ X = Ω_A ⊖ Λ ; ρ_B = {B} ⊖ X = Ω_B ⊖ Λ',
    guidance:
      'Residuals are the movement from Ω_A and Ω_B into Λ, not decorative commentary on what A and B lack. (§12.6)',
  },
  {
    stepId: 'verdict',
    promptTemplate: 'accepted / ambiguous / unsupported',
    formulaTemplate:
      'accept iff Ω_A,Ω_B,Λ,X,ρ_A,ρ_B form one coherent movement',
    guidance:
      'J is sublated, not a third parent. Accept only if Ω_A, Ω_B, Λ, X, ρ_A, ρ_B form one coherent movement; unsupported or ambiguous beats fake naming pressure. (§12.7)',
  },
];

// §10 scoring rubric — six criteria. Guidance for the human only; this module
// scores nothing.
const TRISON_RUBRIC: readonly string[] = [
  '10.1 Radix completion clarity — Do Ω_A and Ω_B clearly state what J becomes with each parent? Weak if the completions are vague paraphrases of the parent terms.',
  '10.2 Duality strength — Does Ω_A ↔ Ω_B reveal a real semantic polarity or tension? Weak if the comparison is merely "A versus B".',
  '10.3 Loop-horizon derivation — Is Λ derived from the completion duality before X is named? Weak if Λ merely restates the child.',
  '10.4 Child complement fit — Does X actually complement J into Λ? Weak if J ⊕ X does not produce the claimed loop horizon.',
  '10.5 Residual family coherence — Are A ⊖ X and B ⊖ X meaningful residuals of the same operation-family? Weak if one residual works and the other is arbitrary.',
  '10.6 Non-blend condition — Is X more than a compromise or midpoint between A and B? Weak if X could have been guessed without J.',
];

// §15 minimal acceptance criteria — ten items, verbatim from the spec.
const TRISON_ACCEPTANCE_CRITERIA: readonly string[] = [
  'explicit J, A, B',
  'two radix completions Ω_A and Ω_B',
  'a comparison Ω_A ↔ Ω_B',
  'a loop horizon Λ derived from that comparison',
  'child X derived as Λ ⊖ J',
  'residuals A ⊖ X and B ⊖ X',
  'verdict: accepted / ambiguous / unsupported',
  'semantic status: candidate naming pressure, not final name',
  'no packet write',
  'no automatic naming claim',
];

function interpolateTriad(
  template: string,
  input: TrisonizedMidwifeTriadInputV0,
): string {
  return template
    .replace(/\{J\}/g, input.sublatedVertex)
    .replace(/\{A\}/g, input.parentA)
    .replace(/\{B\}/g, input.parentB);
}

// Deterministic builder. Interpolates J/A/B into the fixed §6 prompts/formulas,
// sets every slot.answer = null, and attaches the §10 rubric, §15 acceptance
// criteria, and per-slot §12 guidance. Computes nothing semantic.
export function buildTrisonizedMidwifeReadingFrameV0(
  input: TrisonizedMidwifeTriadInputV0,
): TrisonizedMidwifeReadingFrameV0 {
  const slots: TrisonFrameSlotV0[] = TRISON_FRAME_STEP_SPECS.map(
    (spec, index) => ({
      stepId: spec.stepId,
      order: index + 1,
      prompt: interpolateTriad(spec.promptTemplate, input),
      formula: interpolateTriad(spec.formulaTemplate, input),
      answer: null,
      guidance: spec.guidance,
    }),
  );

  return {
    methodId: TRISONIZED_MIDWIFE_METHOD_ID,
    reasoningSource: 'human',
    agentComputation: 'frame-and-questions-only',
    input,
    slots,
    rubric: [...TRISON_RUBRIC],
    acceptanceCriteria: [...TRISON_ACCEPTANCE_CRITERIA],
    semanticStatus: 'candidate-naming-pressure-not-final-name',
    packetWriteStatus: 'not-packet-writing',
    shapeMutationStatus: 'not-shape-mutation',
    namingAuthority: 'human-names',
  };
}

// Human-authored answer capture. Every field is filled by the human, never by
// this module.
export interface TrisonHumanAnswerV0 {
  triadId: string;
  omegaA?: string;
  omegaB?: string;
  duality?: string;
  loopHorizon?: string;
  child?: string;
  residualA?: string;
  residualB?: string;
  verdict?: TrisonVerdict;
}

export interface TrisonAnswerStructureReportV0 {
  complete: boolean;
  missing: string[];
  note: string;
}

const TRISON_REQUIRED_ANSWER_FIELDS = [
  'omegaA',
  'omegaB',
  'duality',
  'loopHorizon',
  'child',
  'residualA',
  'residualB',
  'verdict',
] as const;

const TRISON_STRUCTURE_NOTE =
  'structural presence check only — does NOT judge semantic quality, correctness, or naming; the human remains the naming authority';

function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

// Structural validator: presence-only. It reports which of the eight human
// fields are absent. It makes NO quality judgement — `note` says so explicitly.
export function validateTrisonAnswerStructureV0(
  answer: TrisonHumanAnswerV0,
): TrisonAnswerStructureReportV0 {
  const missing = TRISON_REQUIRED_ANSWER_FIELDS.filter(
    (field) => !isPresent(answer[field]),
  );

  return {
    complete: missing.length === 0,
    missing: [...missing],
    note: TRISON_STRUCTURE_NOTE,
  };
}

// Plain-text rendering of the blank frame for diagnostics/inspection. No I/O.
export function renderFrameLines(
  frame: TrisonizedMidwifeReadingFrameV0,
): string[] {
  const lines: string[] = [];

  lines.push('Trisonized Midwife Reading Frame v0 (blank — human fills every answer)');
  lines.push(`methodId: ${frame.methodId}`);
  lines.push(
    `reasoningSource: ${frame.reasoningSource} | agentComputation: ${frame.agentComputation}`,
  );
  lines.push(
    `triad ${frame.input.triadId}: J=${frame.input.sublatedVertex} A=${frame.input.parentA} B=${frame.input.parentB}`,
  );
  if (frame.input.context !== undefined && frame.input.context.length > 0) {
    lines.push(`context: ${frame.input.context}`);
  }
  lines.push('');
  lines.push('Excavation frame (§6):');
  for (const slot of frame.slots) {
    lines.push(`  ${slot.order}. [${slot.stepId}] ${slot.prompt}`);
    lines.push(`     formula:  ${slot.formula}`);
    lines.push('     answer:   <human-fill>');
    lines.push(`     guidance: ${slot.guidance}`);
  }
  lines.push('');
  lines.push('Rubric (§10):');
  for (const criterion of frame.rubric) {
    lines.push(`  - ${criterion}`);
  }
  lines.push('');
  lines.push('Acceptance criteria (§15):');
  for (const criterion of frame.acceptanceCriteria) {
    lines.push(`  - ${criterion}`);
  }
  lines.push('');
  lines.push(`semanticStatus: ${frame.semanticStatus}`);
  lines.push(
    `packetWriteStatus: ${frame.packetWriteStatus} | shapeMutationStatus: ${frame.shapeMutationStatus} | namingAuthority: ${frame.namingAuthority}`,
  );

  return lines;
}

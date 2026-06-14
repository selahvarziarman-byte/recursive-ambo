# PlatonicEngine Semantic Naming Proposal
## Trisonized Midwife as a Repeatable Method for Semantic Clueing

Audience: mothership, semantic-layer steward, generated-site reading authorities, future agents performing naming support in PlatonicEngine.

Status: conceptual-technical proposal. This is not a Codex prompt, not a UI plan, not a field-layer source-signature rule, and not an automatic naming algorithm. It proposes a repeatable semantic clue-harvesting method for generated-site naming.

---

## 0. Executive summary

PlatonicEngine needs a disciplined way to help a human search for names at generated sites. The existing Midwife intuition says that a generated child is born from a parent edge, but its meaning is made legible by the opposite vertex or projection-source. The risk is that this becomes vague: agents may simply blend the two parent terms, guess a child by association, or use the opposite term as a loose “third influence.”

This document proposes **Trisonized Midwife** as a semantic clueing method.

The method translates Midwife into a semantic complement structure:

```txt
Given an equilateral semantic triad:

        J
       / \
      /   \
     A --- B

J = sublated / projection vertex
A, B = parent terms
X = unknown generated child on edge A—B
```

Instead of guessing `X` directly, the agent first derives two full or radix completions:

```txt
J ⊕ A = Ω_A
J ⊕ B = Ω_B
```

Then it compares those completions and searches for a common loop-horizon:

```txt
Λ = the smaller, recurrent, operational, or poietic completion of J
    that preserves the duality Ω_A ↔ Ω_B
    without collapsing into either Ω_A or Ω_B.
```

Only then does it derive the child:

```txt
X = Λ ⊖ J
```

The parent-child relations become residuals:

```txt
ρ_A = A ⊖ X = Ω_A ⊖ Λ
ρ_B = B ⊖ X = Ω_B ⊖ Λ
```

The child is accepted only if the residuals are semantically meaningful, of the same family, and reveal the movement by which the full completions contract into the loop-completion.

Compact statement:

```txt
Trisonized Midwife searches for a child by:
  two radix completions
  → their shared loop horizon
  → the child as loop-complement
  → residuals as parent-child movement.
```

This method should replace loose “semantic clue harvesting” wherever the object is a triangular/equilateral semantic registry and an edge-child must be named.

---

## 1. Scope and non-scope

### 1.1 Scope

Trisonized Midwife belongs to the **semantic / naming support layer**.

It is useful when PlatonicEngine has or hypothesizes a local semantic triangle:

```txt
three concepts in a balanced registry
one selected parent edge
one opposite / projection / sublated vertex
one unknown generated child on that edge
```

It is designed to help answer:

```txt
What kind of concept can dwell at the generated edge-child site?
```

It can be used inside generated-site readings as one witness among others: geometry, atomic registry, field-cue, lineage, ambiguity, and human notes.

### 1.2 Non-scope

Trisonized Midwife is not:

```txt
a field source-signature law;
a replacement for Quark child inheritance;
a numeric source-profile regime;
a packet-writing rule;
a topology operation;
a proof of semantic truth;
an automatic name generator;
a mystical numerology module;
a general theory of all semantic relation.
```

It should not mutate shape history or write names automatically. It should produce candidate naming pressure and structured clues. The human remains the naming authority.

---

## 2. Project basis

The method is consistent with the project’s existing direction:

```txt
Generated worlds should remain intelligible after transformation.
```

It also preserves the atomic-layer intuition:

```txt
A midpoint can be mediation of its parent edge
and also a projection / sublation site of the face-local opposite vertex.
```

It does not erase the existing Midwife/Quark/Kingmaker distinctions. In Midwife proper, an edge-child is born from an equilateral edge, while the opposite vertex functions as projection-source, orthogonalizer, and symmetry-test. Trisonized Midwife translates this into semantic complement language.

It also obeys the Event Legibility Pivot:

```txt
The generated site remains the center.
The method helps the human read the generated site.
It does not auto-name.
It does not expand field machinery.
```

---

## 3. Why the older clueing style is insufficient

A weak semantic clueing method often does this:

```txt
A, B are parents.
J is the opposite vertex.
Guess X as a plausible blend or mediation of A and B.
Then mention J as context.
```

This fails in three ways.

First, it treats the child as a blend of the parent edge instead of a site made legible by the opposite vertex.

Second, it uses the opposite vertex too late, often as a decorative third pressure.

Third, it does not derive a search vector. It only checks a guess.

Trisonized Midwife reverses the order:

```txt
Do not guess X first.
First derive how J completes with each parent.
Then derive the loop horizon between those completions.
Then derive X as the complement of J inside that loop horizon.
```

The child is searched as a structural necessity, not merely selected by association.

---

## 4. Trison origin, stripped of numerology

The motivating Trison pattern is:

```txt
          n
         / \
        /   \
    10-n --- 9-n
```

It contains:

```txt
n + (10-n) = 10
n + (9-n)  = 9
(10-n) - (9-n) = 1
```

The useful abstraction is not that 10 is good and 9 is evil. The useful abstraction is:

```txt
one joint
+ two neighboring completion regimes
+ a residual between the two complements
```

Generalized:

```txt
J ⊕ D(J) = Ω
J ⊕ N(J) = Λ
D(J) ⊖ N(J) = Ω ⊖ Λ = ρ
```

In semantic terms:

```txt
A concept can be complemented under a full/base horizon.
The same concept can be complemented under a neighboring loop horizon.
The difference between those complements is the residual that generates movement.
```

Trisonized Midwife applies this to the Midwife triangle.

---

## 5. Formal vocabulary

### 5.1 Triangle terms

```txt
J:
  sublated vertex / projection-source / opposite term.

A, B:
  parent terms on the selected edge.

X:
  unknown generated child on edge A—B.
```

Diagram:

```txt
        J
       / \
      /   \
     A --- B
       X
```

### 5.2 Completion terms

```txt
Ω_A:
  radix-completion of J with parent A.
  Formula: J ⊕ A = Ω_A.

Ω_B:
  radix-completion of J with parent B.
  Formula: J ⊕ B = Ω_B.

Λ:
  loop-completion of J through child X.
  Formula: J ⊕ X = Λ.
```

### 5.3 Complement terms

```txt
A:
  radix-complement of J under Ω_A.
  Formula: A = Ω_A ⊖ J.

B:
  radix-complement of J under Ω_B.
  Formula: B = Ω_B ⊖ J.

X:
  loop-complement of J under Λ.
  Formula: X = Λ ⊖ J.
```

### 5.4 Residual terms

```txt
ρ_A:
  residual movement from parent A to child X.
  Formula: ρ_A = A ⊖ X = Ω_A ⊖ Λ.

ρ_B:
  residual movement from parent B to child X.
  Formula: ρ_B = B ⊖ X = Ω_B ⊖ Λ.
```

The residual is not an afterthought. It is the generated movement between full completion and loop completion.

---

## 6. Core operation

Given a semantic triangle `(J; A, B)`, perform:

### Step 1 — Build the two radix completions

Ask:

```txt
What world or horizon appears when J completes with A?
What world or horizon appears when J completes with B?
```

Produce:

```txt
Ω_A = J ⊕ A
Ω_B = J ⊕ B
```

These should be short, meaningful horizon phrases, not vague associations.

Bad:

```txt
J + A = some combination of J and A.
```

Good:

```txt
Ground + Freedom = grounded autonomy.
Ground + Law = founded normativity.
```

### Step 2 — Compare the two radix completions

Do not compare `A` and `B` directly first. Compare:

```txt
Ω_A ↔ Ω_B
```

Ask:

```txt
What is the duality between these two ways of completing J?
What is the shared axis?
What differs?
What must be preserved from both?
```

Example:

```txt
Grounded autonomy ↔ founded normativity.
```

This is not simply:

```txt
Freedom ↔ Law.
```

The point is how both parents complete `J`.

### Step 3 — Derive the loop horizon Λ

This is the main step.

Ask:

```txt
What smaller, repeatable, operational, generated, or poietic horizon
could J enter that preserves the duality Ω_A ↔ Ω_B
without becoming either full completion?
```

The loop horizon is not the child. It is the horizon in which the child will be the complement of `J`.

Examples of contraction modes:

```txt
full closure → operational loop
abstract validity → actionable claim
eternal relation → temporal mission
complete account → uttered instance
fixed point → iteration
final state → dissipative process
appearing truth / coherent truth → intelligible appearance
```

### Step 4 — Derive the child

Once `Λ` is named, solve:

```txt
X = Λ ⊖ J
```

Ask:

```txt
What concept complements J into Λ?
```

Only now name the candidate child.

### Step 5 — Read the residuals

Compute semantically:

```txt
ρ_A = A ⊖ X = Ω_A ⊖ Λ
ρ_B = B ⊖ X = Ω_B ⊖ Λ
```

Ask:

```txt
What does parent A still contain that the child does not?
What does parent B still contain that the child does not?
Are these residuals of the same family?
Do they reveal the movement by which the child is born?
```

### Step 6 — Accept, reject, or suspend

Accept candidate `X` only if:

```txt
Ω_A and Ω_B are meaningful;
Λ is derived from their duality;
X genuinely complements J into Λ;
ρ_A and ρ_B are meaningful residuals;
X is not merely a blend of A and B;
J is not treated as a third parent;
the reading creates useful naming pressure.
```

If these fail, return unsupported or propose multiple candidates with explicit ambiguity.

---

## 7. The key semantic insight

The parent-child relation is the residual.

Because:

```txt
A = Ω_A ⊖ J
X = Λ ⊖ J
```

then:

```txt
A ⊖ X = Ω_A ⊖ Λ
```

Likewise:

```txt
B ⊖ X = Ω_B ⊖ Λ
```

So the relation from parent to child is not merely a visual edge relation. It is the movement from radix-completion to loop-completion.

Compact form:

```txt
Parent → child
=
full complement → loop complement
=
radix horizon → loop horizon
=
poietic residual.
```

This is why Trisonized Midwife can become a naming search vector: it tells the agent not only what the child might be, but what movement generated it.

---

## 8. Agent output format

Every Trisonized Midwife reading should produce the following fields.

```txt
Input triad:
  J = ...
  parent A = ...
  parent B = ...

Radix completion A:
  J ⊕ A = Ω_A = ...
  explanation: ...

Radix completion B:
  J ⊕ B = Ω_B = ...
  explanation: ...

Completion duality:
  Ω_A ↔ Ω_B = ...
  shared axis: ...
  difference: ...

Loop horizon:
  Λ = ...
  derived because: ...
  contraction mode: ...

Child candidate:
  X = Λ ⊖ J = ...
  explanation: ...

Residual A:
  ρ_A = A ⊖ X = Ω_A ⊖ Λ = ...

Residual B:
  ρ_B = B ⊖ X = Ω_B ⊖ Λ = ...

Verdict:
  accepted / ambiguous / unsupported

Naming pressure:
  ...
```

This makes the method repeatable and auditable.

---

## 9. Type schema for later implementation

This is not an implementation mandate, but the method can be represented cleanly.

```ts
interface TrisonizedMidwifeInput {
  triadId: string;
  sublatedVertex: string; // J
  parentA: string;
  parentB: string;
  context?: string;
}

interface SemanticCompletion {
  id: string;
  expression: string;      // e.g. "Ground ⊕ Freedom"
  horizon: string;         // e.g. "grounded autonomy"
  explanation: string;
}

interface CompletionDuality {
  completionA: SemanticCompletion;
  completionB: SemanticCompletion;
  sharedAxis: string;
  contrast: string;
  preservedPressures: string[];
}

interface LoopHorizonCandidate {
  horizon: string;         // Λ
  contractionMode: string; // e.g. "full validity → actionable claim"
  derivedFromDuality: string;
  confidence: 'strong' | 'medium' | 'weak';
}

interface ChildCandidate {
  label: string;           // X
  loopHorizon: string;     // Λ
  complementReading: string; // X = Λ ⊖ J
  residualA: string;       // A ⊖ X
  residualB: string;       // B ⊖ X
  verdict: 'accepted' | 'ambiguous' | 'unsupported';
  warnings: string[];
}

interface TrisonizedMidwifeReading {
  methodId: 'trisonized-midwife-semantic-clueing-v0';
  input: TrisonizedMidwifeInput;
  completionA: SemanticCompletion;
  completionB: SemanticCompletion;
  duality: CompletionDuality;
  loopHorizons: LoopHorizonCandidate[];
  childCandidates: ChildCandidate[];
  semanticStatus: 'candidate-naming-pressure-not-final-name';
  packetWriteStatus: 'not-packet-writing';
  shapeMutationStatus: 'not-shape-mutation';
}
```

---

## 10. Scoring rubric

Candidate children can be scored by six criteria.

### 10.1 Radix completion clarity

```txt
Do Ω_A and Ω_B clearly state what J becomes with each parent?
```

Weak if the completions are vague paraphrases of the parent terms.

### 10.2 Duality strength

```txt
Does Ω_A ↔ Ω_B reveal a real semantic polarity or tension?
```

Weak if the comparison is merely “A versus B.”

### 10.3 Loop-horizon derivation

```txt
Is Λ derived from the completion duality before X is named?
```

Weak if Λ merely restates the child.

### 10.4 Child complement fit

```txt
Does X actually complement J into Λ?
```

Weak if `J + X` does not produce the claimed loop horizon.

### 10.5 Residual family coherence

```txt
Are A ⊖ X and B ⊖ X meaningful residuals of the same operation-family?
```

Weak if one residual works and the other is arbitrary.

### 10.6 Non-blend condition

```txt
Is X more than a compromise or midpoint between A and B?
```

Weak if X could have been guessed without J.

Recommended verdicts:

```txt
strong:
  all six criteria pass.

medium:
  child is plausible but Λ or residuals need refinement.

weak:
  child is associative but not structurally derived.

unsupported:
  no common loop horizon can be derived.
```

---

## 11. Worked examples

### 11.1 Beauty — Unity | Truth

Input:

```txt
J = Truth
A = Beauty
B = Unity
```

Radix completion A:

```txt
Truth ⊕ Beauty = appearing truth
```

Beauty completes Truth by making it manifest, radiant, or presented.

Radix completion B:

```txt
Truth ⊕ Unity = coherent truth
```

Unity completes Truth by gathering it into an intelligible whole.

Completion duality:

```txt
appearing truth ↔ coherent truth
manifestation ↔ integration
radiance ↔ wholeness
```

Loop horizon:

```txt
Λ = intelligible appearance
```

This is derived because it preserves both manifestation and coherence without becoming only Beauty or only Unity.

Child:

```txt
X = Form
```

Because:

```txt
Truth ⊕ Form = intelligible appearance
```

Residuals:

```txt
Beauty ⊖ Form = radiance without determinate intelligibility
Unity ⊖ Form  = bare oneness without appearance
```

Verdict:

```txt
accepted
```

Naming pressure:

```txt
The child born between Beauty and Unity under Truth is Form.
It is truth’s loop-complement as visible coherence.
```

---

### 11.2 Freedom — Law | Ground

Input:

```txt
J = Ground
A = Freedom
B = Law
```

Radix completion A:

```txt
Ground ⊕ Freedom = grounded autonomy
```

Ground completes Freedom by preventing liberty from becoming arbitrary.

Radix completion B:

```txt
Ground ⊕ Law = founded normativity
```

Ground completes Law by preventing law from becoming mere command.

Completion duality:

```txt
grounded autonomy ↔ founded normativity
self-grounded agency ↔ grounded order
freedom with basis ↔ norm with basis
```

Loop horizon:

```txt
Λ = recognized normative claim
```

This is the common loop in which freedom appears as a valid claim and law appears as recognition of that claim.

Child:

```txt
X = Right
```

Because:

```txt
Ground ⊕ Right = recognized normative claim
```

Residuals:

```txt
Freedom ⊖ Right = bare liberty / unclaimed possibility / arbitrariness
Law ⊖ Right     = legality without legitimacy / command without recognized subject
```

Verdict:

```txt
accepted
```

Naming pressure:

```txt
The child born between Freedom and Law under Ground is Right.
It is the loop-complement where ground becomes claimable norm.
```

---

### 11.3 Hope — Action | Knowledge

Input:

```txt
J = Knowledge
A = Hope
B = Action
```

Radix completion A:

```txt
Knowledge ⊕ Hope = grounded expectation
```

Knowledge completes Hope by making hope intelligible rather than wishful.

Radix completion B:

```txt
Knowledge ⊕ Action = applied intervention
```

Knowledge completes Action by making action informed rather than blind.

Completion duality:

```txt
grounded expectation ↔ applied intervention
hypothesis ↔ operation
possible future ↔ enacted test
```

Loop horizon:

```txt
Λ = tested possibility
```

This is the loop where knowledge opens a possibility, action tests it, and hope gives future orientation.

Child:

```txt
X = Experiment
```

Because:

```txt
Knowledge ⊕ Experiment = tested possibility
```

Residuals:

```txt
Hope ⊖ Experiment   = untested expectation / aspiration without trial
Action ⊖ Experiment = doing without epistemic return / blind intervention
```

Verdict:

```txt
accepted
```

Naming pressure:

```txt
The child born between Hope and Action under Knowledge is Experiment.
It is the loop-complement through which knowledge becomes tested possibility.
```

---

## 12. Failure modes and forbidden shortcuts

### 12.1 Guess-first failure

Forbidden pattern:

```txt
Guess X.
Then invent Ω_A, Ω_B, Λ, and residuals around it.
```

Correct pattern:

```txt
Ω_A, Ω_B → duality → Λ → X.
```

### 12.2 No horizon failure

A complement without a horizon is undefined.

Bad:

```txt
A complements J.
```

Good:

```txt
A complements J under horizon Ω_A.
```

### 12.3 Loop horizon as synonym for child

Bad:

```txt
Λ = rightness
X = Right
```

Good:

```txt
Λ = recognized normative claim
X = Right
```

The loop horizon should be the world or completion in which the child functions, not merely the child with abstract suffixes.

### 12.4 Parent blend failure

Bad:

```txt
X is halfway between A and B.
```

Good:

```txt
X is the loop-complement of J derived from Ω_A ↔ Ω_B.
```

### 12.5 Opposite vertex as third parent

Bad:

```txt
X = mixture of A, B, and J.
```

Good:

```txt
J is sublated / projected;
X complements J into Λ;
A and B are parent-radix complements.
```

### 12.6 Residual as decorative commentary

Bad:

```txt
After naming X, say something poetic about what A and B lack.
```

Good:

```txt
A ⊖ X and B ⊖ X are the movements from Ω_A and Ω_B into Λ.
```

### 12.7 Forced support

If no common loop horizon can be derived, return:

```txt
unsupported
```

or:

```txt
ambiguous: multiple loop horizons possible
```

Unsupported is better than fake naming pressure.

---

## 13. Relationship to Midwife, Quark, and Trison

### 13.1 Relation to Midwife proper

Midwife proper:

```txt
edge-child is born from parent edge A—B;
opposite vertex J projects onto that edge;
child X is made legible by that projection.
```

Trisonized Midwife preserves this but expresses it semantically:

```txt
J completes with A as Ω_A.
J completes with B as Ω_B.
J completes with X as Λ.
X is searched through Λ.
```

### 13.2 Relation to Quark

Quark remains a separate atomic / field-source inheritance grammar. It concerns 90-60-30 role-circulation and source-signature derivation.

Trisonized Midwife does not replace Quark.

Possible future relation:

```txt
Quark may supply geometric/field inheritance.
Trisonized Midwife may supply semantic naming pressure.
Both may be witnesses inside a generated-site reading.
```

### 13.3 Relation to the original Trison

Original Trison:

```txt
n
10-n
9-n
```

with:

```txt
n + (10-n) = 10
n + (9-n) = 9
(10-n) - (9-n) = 1
```

Semantic Trisonized Midwife:

```txt
J ⊕ A = Ω_A
J ⊕ X = Λ
A ⊖ X = Ω_A ⊖ Λ
```

The arithmetic values are not imported. The structure is imported:

```txt
one joint
multiple completion horizons
residual between completions
movement from full completion to loop completion
```

---

## 14. Where this method should live

Recommended layer:

```txt
semantic naming support / generated-site reading / atomic-semantic clueing
```

Not recommended layer:

```txt
field source profiles
field atlas computation
shape operation history
packet persistence
UI-first workflow
```

Recommended first artifact:

```txt
TrisonizedMidwifeReadingV0
```

This can begin as a pure report object, not a UI feature and not a stored packet.

---

## 15. Minimal acceptance criteria

A Trisonized Midwife report is acceptable only if it includes:

```txt
1. explicit J, A, B;
2. two radix completions Ω_A and Ω_B;
3. a comparison Ω_A ↔ Ω_B;
4. a loop horizon Λ derived from that comparison;
5. child X derived as Λ ⊖ J;
6. residuals A ⊖ X and B ⊖ X;
7. verdict: accepted / ambiguous / unsupported;
8. semantic status: candidate naming pressure, not final name;
9. no packet write;
10. no automatic naming claim.
```

If a report gives only a child label and a poetic explanation, it is not a Trisonized Midwife report.

---

## 16. Compact method card for agents

```txt
TRISONIZED MIDWIFE METHOD

Input:
  Equilateral semantic triad (J; A, B)
  J = sublated/projection vertex
  A,B = parent edge
  X = unknown child

Do not guess X first.

1. Compute radix completions:
   J ⊕ A = Ω_A
   J ⊕ B = Ω_B

2. Compare completions:
   Ω_A ↔ Ω_B

3. Derive loop horizon:
   Λ = common reduced / recurrent / operational completion
       preserving Ω_A ↔ Ω_B

4. Derive child:
   X = Λ ⊖ J

5. Read residuals:
   ρ_A = A ⊖ X = Ω_A ⊖ Λ
   ρ_B = B ⊖ X = Ω_B ⊖ Λ

6. Verdict:
   accept only if Ω_A, Ω_B, Λ, X, ρ_A, ρ_B form one coherent movement.

Output:
   candidate naming pressure, not final name.
```

---

## 17. Final recommendation

PlatonicEngine should adopt **Trisonized Midwife** as the primary semantic clueing method for triangular generated-site naming support.

It is strong because it:

```txt
keeps the generated child centered;
uses the opposite vertex structurally, not decoratively;
turns naming into a search vector rather than a guess;
preserves parent-child residual movement;
returns unsupported when no loop horizon can be found;
keeps human naming authority intact.
```

The method should be introduced as a semantic-layer report or memo first. It should not immediately become packet persistence or UI. Its first purpose is to discipline agents and human collaborators so that generated-site naming pressure becomes traceable, repeatable, and inspectable.


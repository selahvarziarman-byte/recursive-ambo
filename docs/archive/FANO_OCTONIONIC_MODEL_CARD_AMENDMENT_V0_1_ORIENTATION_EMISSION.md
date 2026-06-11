# Fano-Octonionic Model Card Amendment V0.1
## Orientation, Quotient, Label Scope, and Emission Projection Corrections

Status: **binding amendment to `FANO_OCTONIONIC_BIRTH_AND_LOCAL_CHANNEL_MODEL_CARD_V0.md`**  
Purpose: correct the model before any C0 table prototype or Codex implementation.

This amendment records four corrections that are now mandatory:

1. vertex/edge labels are placeholders and must not become the algebra;
2. orientation must be explicit and must not slip between `CD` and `DC`;
3. antipodality must be derived from signed carrier lifts, not manually listed;
4. emission must remain separated into oscillator profile, field-facing projection, structural carrier state, and channel-response kernel.

---

## 1. Label scope: names are placeholders, not algebraic objects

The symbols:

```txt
A, B, C, D
M_AB, M_AC, ...
AB, CD, ...
```

are placeholders for source tokens and carrier configurations. They are not themselves the semantic names of the vertices or children.

A child born from `A-B` may later receive one semantic label, for example `K`. That label belongs to the semantic/user layer. It is not the algebraic child identity.

The carrier identity is:

```txt
source-token
parent set
ordered carrier lift
product-axis ray
orientation sign
birth path / bracketing data
```

The semantic label is:

```txt
user-authored or human-approved name attached to a source-token
```

Therefore:

```txt
labels do not multiply;
labels do not have octonion products;
nonassociativity does not operate on labels;
nonassociativity operates on carrier expressions / birth paths.
```

For later strings of vertices, the same rule holds. A carrier path such as:

```txt
(A·B)·C
```

may have a different carrier meaning from:

```txt
A·(B·C)
```

but any semantic label attached to that born source is a separate layer. The algebra constrains the source-token and its channel relations. It does not automatically rename the semantic object.

---

## 2. Orientation slippage: `CD` is not the same as `DC`

The original model card correctly gestures toward an oriented complement convention:

```txt
M_AB: A·B = +e3
M_CD: D·C = -e3
```

But any prose or example that writes the complement birth as:

```txt
C·D = q_CD
```

without qualification is unsafe.

Under the stated Fano convention:

```txt
C·D = e4·e7 = +e3
D·C = e7·e4 = -e3
```

So `C·D` does not give the signed antipode of `A·B`; it gives the same signed product-axis lift. The intended antipodal lift requires `D·C`.

This is not cosmetic. The whole carrier-antipode claim depends on this orientation.

---

## 3. Required oriented opposite-edge convention

Unordered source-token labels may remain:

```txt
M_AB
M_CD
M_AC
M_BD
M_AD
M_BC
```

But the carrier multiplication order must be recorded separately.

The oriented opposite-edge lift convention for the canonical quadrangle is:

```txt
AB / DC
AC / BD
AD / CB
```

Expanded:

```txt
M_AB uses carrier lift A·B = +e3
M_CD uses carrier lift D·C = -e3

M_AC uses carrier lift A·C = +e5
M_BD uses carrier lift B·D = -e5

M_AD uses carrier lift A·D = +e6
M_BC uses carrier lift C·B = -e6
```

The unordered child name `M_CD` is still valid. But its signed carrier lift for the antipodal relation to `M_AB` is `D·C`, not `C·D`.

The model must always distinguish:

```txt
child token name:
  M_CD

parent set:
  {C,D}

carrier lift:
  D·C

carrier ray:
  e3

orientation sign:
  -
```

---

## 4. Do not hard-code complements before derivation

The C0 prototype must not take this as input:

```txt
M_AB complement M_CD
M_AC complement M_BD
M_AD complement M_BC
```

as the source of truth.

The prototype must compute:

```txt
1. all four primal source carriers;
2. all six unordered pair source-tokens;
3. both ordered carrier lifts for each pair-token;
4. signed product-axis for every ordered lift;
5. carrier ray for every lift;
6. pair-exhaustive candidates;
7. antipodal relations as:
   distinct token
   + disjoint parent set
   + same carrier ray
   + opposite sign.
```

Only after that may it print the familiar antipodal pairs.

The dangerous false derivation would be:

```txt
define complement map first;
choose multiplication orders to make the signs work;
claim the algebra derived the relation.
```

The corrected derivation is:

```txt
define Fano multiplication convention;
define canonical quadrangle;
generate all pair tokens and signed lifts;
compute pair-exhaustive same-ray opposite-sign relations;
print the result.
```

---

## 5. Signed lift table as the real C0 core

C0 should first produce a lift table, not only a child table.

Example schema:

```txt
child token | parent set | lift | product | ray | sign
M_AB        | {A,B}      | A·B  | +e3     | e3  | +
M_AB        | {A,B}      | B·A  | -e3     | e3  | -

M_CD        | {C,D}      | C·D  | +e3     | e3  | +
M_CD        | {C,D}      | D·C  | -e3     | e3  | -
```

Then antipodal output is computed from the lift table.

For example, relative to the positive lift `A·B = +e3`, the antipodal lift is:

```txt
D·C = -e3
```

Thus the oriented display pair is:

```txt
AB / DC
```

The source-token pair is still:

```txt
M_AB / M_CD
```

---

## 6. Antipodality language must be tightened

The model card currently uses:

```txt
conjugate / spinor-antipode
```

This should be tightened.

Use now:

```txt
signed carrier-ray antipode
octonionic conjugate orientation
opposite signed lift of the same carrier ray
```

Reserve for later:

```txt
spinor-antipode
triality
spinorial lift
```

At the current model level, what is actually formalized is:

```txt
+e_i and -e_i are opposite signed lifts of the same imaginary octonion ray.
```

Octonion conjugation gives:

```txt
conj(e_i) = -e_i
```

So “octonionic conjugate orientation” is legitimate now.

“Spinor-antipode” becomes legitimate only after the model defines a spinor representation, a lift into spinorial state, or a Spin/triality action. Until then it should appear only as a future semantic/mathematical horizon.

---

## 7. Corrected antipodal quotient wording

Use:

```txt
M_XY and M_ZW are antipodal iff:

1. distinct source-token:
   M_XY ≠ M_ZW

2. pair-exhaustion:
   {X,Y} ∪ {Z,W} = {A,B,C,D}
   and {X,Y} ∩ {Z,W} = ∅

3. carrier-ray condition:
   ray(product(lift_XY)) = ray(product(lift_ZW))

4. signed-lift opposition:
   sign(product(lift_XY)) = - sign(product(lift_ZW))
```

Where `lift_XY` and `lift_ZW` are ordered carrier lifts selected by the computed relation, not by the unordered token name.

The output can then state:

```txt
M_AB and M_CD are source-token antipodes by lifts A·B / D·C.
M_AC and M_BD are source-token antipodes by lifts A·C / B·D.
M_AD and M_BC are source-token antipodes by lifts A·D / C·B.
```

---

## 8. Emission remains the weakest part of the model

The carrier side is strong. The emission side is still only candidate-level.

The current candidate law is:

```txt
ψ_AB_birth = κ_AB · ψ_A · ψ_B
```

with a possible decomposition:

```txt
amplitude_AB   = κ_AB · amplitude_A · amplitude_B
frequency_AB   = frequency_A + frequency_B
phase_AB       = phase_A + phase_B + signOffset
attenuation_AB = attenuation_A + attenuation_B
```

This is a reasonable first modulation idea, but it is not yet a field law.

Three risks must be kept explicit.

### 8.1 Temporal oscillator versus spatial field projection

The oscillator expression is temporal:

```txt
ψ(t) = a · exp(i(ωt + φ)) · exp(-γt)
```

The old field atlas used spatial propagation:

```txt
phase_at_point = k · distance + phase
```

These are not automatically the same.

The model must define a projection from oscillator profile to field-facing propagation profile:

```txt
OscillatorEmissionProfile
  ↓ projection policy
FieldFacingPropagationProfile
```

A source therefore has at least:

```txt
intrinsic oscillator emission:
  amplitude, frequency, phase, damping

field-facing propagation projection:
  amplitude, waveNumber, phase, attenuation
```

This prevents the old error of reducing structure to a scalar/phase tuple.

### 8.2 Frequency growth

If the child frequency is simply:

```txt
ω_AB = ω_A + ω_B
```

then recursive generations may explode.

The model will need one of:

```txt
octave folding
frequency normalization
finite profile-library snapping
attenuation suppression
coupling cutoff
generation-depth damping
```

This does not have to be solved in the carrier table, but E0/E1 cannot ignore it.

### 8.3 signOffset cannot become a patch

If the carrier sign affects phase, the rule must be explicit.

For example:

```txt
orientation sign + => phase offset 0
orientation sign - => phase offset π
```

But this must be stated as a projection convention from signed carrier lift into field-facing phase. It must not imply that carrier structure has been reduced to phase.

Correct separation:

```txt
signed carrier lift:
  structural carrier state

phase offset:
  field-facing projection of carrier orientation
```

---

## 9. E1 must distinguish four layers

The emission prototype must not print only child emissions.

It must distinguish:

```txt
1. intrinsic oscillator emission
   temporal/harmonic profile

2. field-facing propagation projection
   amplitude, waveNumber, phase, attenuation

3. structural carrier state
   source token, pair, ordered lift, product axis, ray, sign

4. channel-response kernel
   parent-return, projection-loop, complement coupling
```

A child source therefore has:

```ts
interface BornSource {
  token: string;
  structuralCarrierState: StructuralCarrierState;
  intrinsicOscillatorEmission: OscillatorEmissionProfile;
  fieldFacingPropagation: FieldFacingPropagationProfile;
  channelResponseKernel: LocalChannelKernel;
}
```

This is the minimal guard against reintroducing the old mistake where the emitted tuple pretended to be the full source state.

---

## 10. Revised C0 pass criteria

C0 passes only if it can print:

```txt
1. primal carriers A,B,C,D;
2. all six unordered pair source-tokens;
3. all twelve ordered carrier lifts;
4. signed product-axis for every lift;
5. carrier ray for every lift;
6. antipodal relations derived from disjoint parent set + same ray + opposite sign;
7. familiar output pairs AB/DC, AC/BD, AD/CB;
8. source-token output pairs M_AB/M_CD, M_AC/M_BD, M_AD/M_BC.
```

C0 fails if:

```txt
1. it lists complement pairs before computing lift products;
2. it uses C·D where D·C is required for the signed antipode of A·B;
3. it collapses M_AB and M_CD into one source-token;
4. it claims spinor machinery without defining it;
5. it treats phase/sign offset as the structural relation itself.
```

---

## 11. Revised immediate next step

Before any C0 implementation, the model card should be patched with this amendment.

The next document/code step should be:

```txt
C0 — signed carrier lift table prototype
```

not merely:

```txt
C0 — child carrier table
```

The lift table is the proof object. The child table is a projection of it.

---

## 12. Compact binding correction

Future work should follow this compact correction:

```txt
Unordered child labels are names of source-tokens.
Ordered products are carrier lifts.
Antipodality is computed from signed carrier lifts.
The oriented complement pairs are AB/DC, AC/BD, AD/CB.
The familiar source-token pairs are M_AB/M_CD, M_AC/M_BD, M_AD/M_BC.
Spinor language is reserved until a spinor representation is defined.
Emission profiles must be separated from field-facing propagation projection.
```

# Fano-Octonionic Birth and Local Channel Model Card V0

Status: **candidate model card / pre-code carrier specification**  
Parent record: `PLATONIC_ENGINE_FANO_OCTONIONIC_FIELD_SOLUTION_RECORD.md`  
Purpose: define the first testable mathematical carrier and inheritance regime for the field layer.

This document does not ask for UI work. It states the proposed carrier model in a form that can later be converted into pure tables and pass/fail checks.

---

## 0. Core claim

The field layer should begin from a generational source model:

```txt
four primal sources
  emit
  interact
  give birth to six child sources
  which join the active source population
  and thereby change the field
```

The proposed mathematical carrier for this birth process is:

```txt
Fano-octonionic carrier / inheritance
+
finite harmonic oscillator emission profile
+
local channel-response kernel
+
Trisonized semantic residual reading
```

The key object is not a field panel and not a generated-site reading. The key object is the born source:

```txt
M_AB = child source-token born from primal sources A and B
```

A born source carries:

```txt
pair identity
octonion product-axis class
orientation / conjugacy relation
intrinsic oscillator emission
local response channels
semantic residual potential
```

---

## 1. Canonical Fano-octonionic universe

Use imaginary octonion units:

```txt
e1, e2, e3, e4, e5, e6, e7
```

The first canonical primal quadrangle is:

```txt
A = e1
B = e2
C = e4
D = e7
```

This choice is selected because its pairwise products produce three shared product axes for the six pair-children.

### 1.1 Multiplication convention

Use the oriented Fano triples:

```txt
(1,2,3)
(1,4,5)
(1,7,6)
(2,4,6)
(2,5,7)
(3,4,7)
(3,6,5)
```

For each oriented triple `(i,j,k)`:

```txt
e_i · e_j = e_k
e_j · e_k = e_i
e_k · e_i = e_j
```

Reversing order changes sign.

This convention is not sacred. It is the first explicit convention to test. If it fails, the failure should be visible in the tables.

---

## 2. Primal source object

A primal source is octonion carrier first, oscillator emission second.

```ts
interface PrimalSource {
  id: 'A' | 'B' | 'C' | 'D';
  carrier: 'e1' | 'e2' | 'e4' | 'e7';
  harmonicProfileId: string;
  emission: {
    amplitude: number;
    frequency: number;
    phase: number;
    attenuation: number;
  };
}
```

The carrier determines orientation, pair-birth, local channel grammar, complement classes, and later non-associative behavior.

The emission profile determines how the source sings into the field.

The first model can use finite harmonic profiles. The profile library is not defined here, but candidate mines include:

```txt
equal-energy tetrahedral phase profiles
Pythagorean / just-intonation ratios
octave-fifth-third product cycles
finite samples on a harmonic torus
```

The crucial point is that harmonic profiles are not the ontology. They are finite emission profiles attached to carriers.

---

## 3. Child source-token

A child is not merely an octonion product axis.

A child source-token preserves pair identity while also carrying product-axis and orientation data.

```ts
interface ChildSourceToken {
  id: 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
  parentSet: [string, string];
  carrierOrientation: [string, string]; // ordered carrier multiplication
  productAxis: 'e3' | 'e5' | 'e6';
  orientationSign: '+' | '-';
  axisClass: 'axis:e3' | 'axis:e5' | 'axis:e6';
  complementToken: string;
  antipodalRelation: {
    distinctSourceToken: true;
    sameCarrierRay: true;
    conjugateOrSpinorAntipode: true;
  };
  intrinsicBirthEmission: ChildIntrinsicEmission;
  localChannelKernel: LocalChannelKernel;
}
```

A child must be simultaneously:

```txt
distinct as a source-token
equivalent under carrier-ray quotient
opposed under conjugate / spinor-antipodal orientation
```

For example:

```txt
M_AB ≠ M_CD                       as source-tokens
axis(M_AB) = axis(M_CD)           as carrier-ray class
M_AB ↔ M_CD                       as conjugate / spinor-antipodal pair
```

---

## 4. Birth carrier table

The model’s first major test is whether six child tokens are born from four primal carriers and organize into three carrier-axis pairs.

Use an oriented tetrahedral complement convention. Child token names may be unordered pair names, while the carrier orientation records the ordered multiplication needed to expose conjugacy.

```txt
child token | carrier orientation | product | axis class | complement token
M_AB        | A·B                 | +e3     | axis:e3    | M_CD
M_CD        | D·C                 | -e3     | axis:e3    | M_AB

M_AC        | A·C                 | +e5     | axis:e5    | M_BD
M_BD        | B·D                 | -e5     | axis:e5    | M_AC

M_AD        | A·D                 | +e6     | axis:e6    | M_BC
M_BC        | C·B                 | -e6     | axis:e6    | M_AD
```

This table is the first place the quotient structure appears.

The complement child is not attached by a later report. It is visible in the carrier-axis class and conjugate orientation.

---

## 5. Antipodal quotient rule

The model defines antipodality by a three-part condition:

```txt
M_XY and M_ZW are antipodal iff:

1. distinct source-token:
   M_XY ≠ M_ZW

2. pair-exhaustion:
   {X,Y} ∪ {Z,W} = {A,B,C,D}
   and {X,Y} ∩ {Z,W} = ∅

3. carrier-ray conjugacy:
   productAxis(M_XY) = productAxis(M_ZW)
   and orientation(M_ZW) = conjugate / spinor-antipode of orientation(M_XY)
```

Thus antipodality is not a simple sign flag. It is a quotient relation:

```txt
distinct token
same ray
opposed lift
```

This relation is the carrier version of the octahedral opposite-edge structure born from the tetrahedral fourfold.

---

## 6. Local channel grammar

At each born child, several local carrier channels become available.

For `M_AB`, let:

```txt
q_AB = A·B = +e3
```

### 6.1 Birth channel

```txt
A·B = q_AB
```

The child source is born.

### 6.2 Child-parent return channels

```txt
q_AB · A = B        up to sign/ray
q_AB · B = A        up to sign/ray
```

The child coupled with one parent returns or orients toward the other parent.

### 6.3 Child-projection / sublation loop channels

For edge `AB`, the projected/opposite sources are `C` and `D`.

```txt
q_AB · C = D        up to sign/ray
q_AB · D = C        up to sign/ray
```

The child coupled with one projected source returns or orients toward the other projected source.

This is the carrier version of the projection/sublation loop.

### 6.4 Complement birth channel

```txt
D·C = q_CD = -e3
```

The complement child is born on the same carrier ray with conjugate/opposed orientation.

---

## 7. General local channel table

Each child should produce the same channel families.

```txt
child | birth | child-parent return | child-projection loop | complement birth
M_AB  | A·B   | q_AB·A→B, q_AB·B→A | q_AB·C→D, q_AB·D→C   | D·C→q_CD
M_AC  | A·C   | q_AC·A→C, q_AC·C→A | q_AC·B→D, q_AC·D→B   | B·D→q_BD
M_AD  | A·D   | q_AD·A→D, q_AD·D→A | q_AD·B→C, q_AD·C→B   | C·B→q_BC
M_BC  | C·B   | q_BC·B→C, q_BC·C→B | q_BC·A→D, q_BC·D→A   | A·D→q_AD
M_BD  | B·D   | q_BD·B→D, q_BD·D→B | q_BD·A→C, q_BD·C→A   | A·C→q_AC
M_CD  | D·C   | q_CD·C→D, q_CD·D→C | q_CD·A→B, q_CD·B→A   | A·B→q_AB
```

The exact signs must be computed by the multiplication convention. The table above states the intended ray-level recoveries.

---

## 8. Emission structure

Each primal source has an oscillator emission:

```txt
ψ_A(t) = a_A · exp(i(ω_A t + φ_A)) · exp(-γ_A t)
```

Each child has an intrinsic birth emission plus a local channel-response kernel.

### 8.1 Intrinsic birth emission

The simplest candidate law is product modulation:

```txt
ψ_AB_birth(t) = κ_AB · ψ_A(t) · ψ_B(t)
```

This can be decomposed into:

```txt
amplitude_AB   = κ_AB · amplitude_A · amplitude_B
frequency_AB   = frequency_A + frequency_B       // first candidate
phase_AB       = phase_A + phase_B + signOffset
attenuation_AB = attenuation_A + attenuation_B
```

This is a candidate rule, not yet final. The important design point is that the child emission is born from the parent emissions but carried by the octonion product orientation.

### 8.2 Local channel-response kernel

The child also has response channels:

```txt
parent-return channels
projection-loop channels
complement-coupling channel
```

These channels are not necessarily always-on free emissions. They are part of the child’s profile as response possibilities.

For `M_AB`:

```ts
localChannelKernel: {
  parentReturn: [
    { with: 'A', returnsRay: 'B' },
    { with: 'B', returnsRay: 'A' }
  ],
  projectionLoop: [
    { with: 'C', returnsRay: 'D' },
    { with: 'D', returnsRay: 'C' }
  ],
  complementCoupling: {
    with: 'M_CD',
    sharedAxis: 'axis:e3',
    relation: 'conjugate-or-spinor-antipode'
  }
}
```

Thus the child is more than birth-only, but it does not explode into every possible relation as an always-on signal.

---

## 9. Projection / sublation and associator residues

Projection/sublation may be grounded in non-associative bracketing.

For child:

```txt
X = A·B
```

and projected source:

```txt
J = C
```

compare the radix path:

```txt
(C·A)·B
```

with the loop path:

```txt
C·(A·B)
```

The carrier displacement is the associator:

```txt
[C,A,B] = (C·A)·B - C·(A·B)
```

The hypothesis:

```txt
Trison residual movement is the semantic reading of this carrier displacement.
```

This must be tested. If the associators do not produce coherent local residues, Trison remains semantic-only and should not be claimed as carrier-anchored.

---

## 10. Trisonized semantic residual attachment

Trisonized Midwife supplies semantic reading for local carrier channels.

Given:

```txt
J = projected / sublated source
A,B = parent sources
X = born child
```

semantic operations are:

```txt
J ⊕ A = Ω_A
J ⊕ B = Ω_B
J ⊕ X = Λ

X = Λ ⊖ J

ρ_A = A ⊖ X = Ω_A ⊖ Λ
ρ_B = B ⊖ X = Ω_B ⊖ Λ
```

Carrier anchoring proposal:

```txt
J·A       anchors Ω_A
J·B       anchors Ω_B
J·X       anchors Λ
X·A, X·B  anchor parent-return residuals
associator [J,A,B] anchors radix-to-loop displacement
```

In a tetrahedron, each child has two projected sources. For `M_AB`:

```txt
J = C
J = D
```

So semantic clueing is likely tetra-local rather than single-face-local:

```txt
run Trison reading through C
run Trison reading through D
compare both loop horizons and residuals
```

---

## 11. Generational field update

The field is updated by source birth.

```txt
G0 active sources:
  A, B, C, D

born during G0→G1:
  M_AB, M_AC, M_AD, M_BC, M_BD, M_CD

G1 active sources:
  A, B, C, D,
  M_AB, M_AC, M_AD, M_BC, M_BD, M_CD
```

The free field can be modeled as:

```txt
F_G(t) = Σ intrinsicEmission(source_i)
```

The interaction field may then include activated local channel-response kernels among co-present sources.

The first version only needs to show the source population update and the born source profiles.

---

## 12. Required pure tables

The first non-UI prototype must produce these tables.

### Table A — primal source table

```txt
source | carrier | profile | amplitude | frequency | phase | attenuation
A      | e1      | P_A     | ...       | ...       | ...   | ...
B      | e2      | P_B     | ...       | ...       | ...   | ...
C      | e4      | P_C     | ...       | ...       | ...   | ...
D      | e7      | P_D     | ...       | ...       | ...   | ...
```

### Table B — birth carrier table

```txt
child | parent set | carrier orientation | product axis | sign | complement
M_AB  | A,B        | A·B                 | e3           | +    | M_CD
M_CD  | C,D        | D·C                 | e3           | -    | M_AB
...
```

### Table C — antipodal quotient table

```txt
axis | child + | child - | distinct tokens | same carrier ray | conjugate/spinor antipode
e3   | M_AB    | M_CD    | true            | true             | true
e5   | M_AC    | M_BD    | true            | true             | true
e6   | M_AD    | M_BC    | true            | true             | true
```

### Table D — local channel table

```txt
child | channel type | operation | result ray | interpretation
M_AB  | birth        | A·B       | e3         | child born
M_AB  | parent-return| q_AB·A    | B          | returns other parent
M_AB  | projection   | q_AB·C    | D          | loops to other projected source
...
```

### Table E — associator / Trison residue table

```txt
child | J | radix path | loop path | associator | semantic role
M_AB  | C | (C·A)·B    | C·(A·B)   | [C,A,B]    | Ω_A → Λ residual
M_AB  | D | (D·A)·B    | D·(A·B)   | [D,A,B]    | Ω_A → Λ residual
...
```

### Table F — emission envelope table

```txt
child | intrinsic birth emission | parent-return kernel | projection-loop kernel | complement coupling
M_AB  | ψ_AB_birth               | A,B                  | C,D                    | M_CD
...
```

### Table G — generational field update table

```txt
step | active sources before | born sources | active sources after
G0→G1| A,B,C,D               | six children | A,B,C,D + six children
```

---

## 13. Pass criteria

The candidate model passes the first carrier test if:

```txt
1. four primal sources are represented as carrier + emission profile;
2. six child source-tokens are born from pairwise carrier products;
3. child tokens remain distinct even when carrier rays coincide;
4. three carrier-axis classes are produced;
5. three antipodal pairs are derived by quotient structure;
6. child-parent return channels recover the other parent ray;
7. child-projection loop channels recover the other projected-source ray;
8. emission is separated into intrinsic birth emission and channel-response kernel;
9. associator tables are computable for projection/sublation tests;
10. the generation update from G0 to G1 is explicit.
```

The model earns semantic attachment only if Trison residuals can be meaningfully anchored to the local carrier channels or associator residues.

---

## 14. Falsifiers

The model fails if:

```txt
1. the chosen Fano quadrangle cannot produce six distinct child tokens;
2. carrier-axis pairing collapses six children into three without preserving token identity;
3. antipodality cannot be stated as distinct token + same ray + conjugate/spinor opposition;
4. child-parent return channels do not recover the other parent ray;
5. child-projection loop channels do not recover the opposite projected-source ray;
6. associator residues do not distinguish radix path from loop path;
7. emission inheritance becomes arbitrary hand-tuning detached from carrier operations;
8. channel-response kernels make the field explode before generation two;
9. Trison semantics remains guesswork not anchored to carrier channels;
10. the model cannot state the G0→G1 source population update cleanly.
```

---

## 15. Immediate unresolved choices

This model card intentionally leaves several choices open for the next review.

### 15.1 Harmonic profile library

The finite initial profile library must be selected.

Candidate first libraries:

```txt
equal-energy tetrahedral phase profile
Pythagorean tetrad
just-intonation tetrad
finite octave/fifth/third torus sample
```

### 15.2 Exact emission birth law

The default candidate is product modulation:

```txt
ψ_AB_birth = κ_AB · ψ_A · ψ_B
```

but this can be revised.

### 15.3 Exact antipodal formalism

The model currently uses:

```txt
conjugate / spinor-antipode
```

as the target relation. The exact formal representation must be selected.

### 15.4 Associator-to-Trison mapping

The proposed mapping is:

```txt
Trison residual = semantic reading of carrier associator displacement
```

This must be tested and may fail.

---

## 16. Next step after this model card

The next step is a pure non-UI prototype:

```txt
C0 — Fano-Octonionic Carrier Table Prototype
```

It should implement only:

```txt
octonion multiplication convention
canonical Fano quadrangle
four primal carrier rows
six child carrier rows
three quotient/antipodal rows
local channel rows
```

It should print tables. It should not touch app UI.

---

## 17. Closing statement

This model card states the first testable carrier for the PlatonicEngine field layer.

The proposal is not that octonions are decorative. The proposal is that the Fano-octonionic carrier may be the first structure capable of explaining:

```txt
why four primal sources produce six children;
why six children form three antipodal axes;
why the child can return to parents;
why the child loops with projected/opposite sources;
why projection/sublation may involve non-associative bracketing;
why semantic residuals may be read through Trisonized Midwife;
why field evolution is source-population growth.
```

The model should now be tested as tables. If the tables work, field work can resume from a real carrier. If they fail, the field layer should remain outside the app.

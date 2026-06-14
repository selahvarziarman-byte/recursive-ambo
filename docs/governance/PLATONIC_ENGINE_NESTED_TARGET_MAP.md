# PlatonicEngine — Nested Target Map (Remaining Work)

Author: mothership, 2026-06-14, branch `team-arman`. Status: planning map, sovereign-requested. **Targets are not campaigns** — each campaign has several targets that together reach its end. Every node is cited to a repo doc/gate/spec/proven-result; nothing is invented. Where the repo is silent, the node is marked OPEN-DESIGN, not filled in.

Status legend: **[DONE]** satisfied & ratified · **[PARTIAL]** substrate exists, incomplete · **[OPEN]** not yet hit · **[OPEN-DESIGN]** needed but unspecified in repo · **[GATED]** cannot start until a predecessor clears · **[INFERRED]** mothership-derived from standing discipline (flagged, not from a single doc).

---

## NORTH STAR (the thing both campaigns serve)

```txt
"A generated world remains intelligible after transformation."  (Ground Plan §12)
realized as a "topological life-of-concepts workspace."         (Foundational Inspector §1)
Pipeline: place concepts on a seed -> generate -> read -> name -> repeat -> topologically transform -> interpret.
```

---

## MINOR CAMPAIGN — complete the NON-topological module
**Ultimate end:** a module that hands the topological module **clean, named, honestly-signed, importable** material (the inheritance rule: Vital Note §16, Field-Cue §18). Decomposition follows the project's own gate ladder (Current-State Dependency Map, Gates A–I), reconciled with what the closed campaigns already settled.

```txt
M1. SOURCE-STATE TRUTH, HONESTLY SIGNED            [Gates A–C + Vital Note §16]      [DONE, residual]
    - structured source-state capsule built + proven source-state-real (D1) and general
      across the tetra-octa-cube hub (D3, gauge-invariant): src/lib/hubLayerSourceStateCapsuleV0.ts
    - tuple/signature conflation audit performed (PLATONIC_ENGINE_TUPLE_SIGNATURE_CONFLATION_AUDIT.md)
    - RESIDUAL: verify end-to-end that no tuple-as-signature "lie" reaches exportable material
      (the literal precondition for topology, Vital §16). [OPEN, small]

M2. FIELD DEMOTED TO HONEST WITNESS                [Gate D, resolved]               [DONE]
    - IV-A ratified: the field is inactive; the reader presents nothing as field-active and
      carries the mandatory misleading-raw-field warning. The field now honestly reports
      "no pressure." (This is the charter's §13 "field contributes pressure OR honestly reports
      when it does not" — satisfied by the negative branch.)

M3. HONEST, LEGIBLE GENERATED-SITE READING          [Gates E–F]                      [PARTIAL]
    ├─ honest source-state reader BUILT: src/lib/honestSourceStateReadingV0.ts
    │  (geometry witness + birth-law witness + naming prompt; field claims stripped)   [DONE]
    ├─ FOLD IN the FOUND generality as legitimate structural witnesses to the reading:
    │  W-1 source-state legitimacy, the channel theorem, the 60°/A3/vector-equilibrium/
    │  medial-hub invariants (Bench-1/2, D3). [sovereign: "useful for legibility anyway"] [OPEN]
    └─ CLOSE THE HUMAN-FRUIT TEST (Gate F = the old D4): does the event let the human
       understand something they could not before? Deferred, then DECLINED during the field
       campaign -> the decisive OPEN target of this campaign.                          [OPEN]

M4. DISPLAY / UI SURFACE                             [Gate G]                          [PARTIAL]
    - render the honest reading under a display contract, no tuple-as-signature leakage.
      Panels exist (Panels.tsx: GeneratedSiteReadingV0Panel, FieldCue display); the
      honest-reader + naming surface is not yet the product surface.

M5. HUMAN NAMING WORKFLOW                            [Gate H]                          [OPEN]
    - the human names / rejects / suspends / revises generated-site dwellings WITH STATUS
      (candidate/confirmed/rejected/suspended), never auto-truth (Ground Plan §5.6; Charter §11).
    - THIS TARGET PRODUCES THE NAMED MATERIAL the topological module imports. Packet editing
      today is primal-vertex-only (ARCHITECTURE.md); generated-site naming is unbuilt.

M6. GENERALITY AUDIT + BOUNDED PORTABILITY          [Charter §8 + Gate I]             [PARTIAL]
    ├─ generality QUESTION largely settled by the campaigns: field NOT general (proven);
    │  source-state IS general across the hub (D3). Record this as the audit's spine.   [DONE]
    └─ the reading layer is still typed 'not-general-reading-layer'/'untested'
       (generatedSiteReadingV0.ts). ONE bounded portability test remains: same seed one
       deeper generation, OR different seed same operation, OR same reading idea one
       different domain (Charter §8; Lieutenant §9).                                    [OPEN]

M7. IMPORT / HANDOFF READINESS  (THE BRIDGE)        [inheritance rule; Topo spec §8 req 1–2] [OPEN-DESIGN]
    - the named, signed, legible material must be SELECTABLE and LIFTABLE as a "named site
      configuration / subcomplex with provenance" — the topological module's input.
    - This is the capstone of the minor campaign and the joint to the major. Its mechanism
      (select + export a named subcomplex) is NOT specified anywhere in the repo. [report ignorance]
```

---

## MAJOR CAMPAIGN — the TOPOLOGICAL MODULE
**Ultimate end:** named ambo/dual material transformed topologically, with a complete, faithful **correspondence ledger**, ready for the semantic layer. Decomposition from the sovereign's canonical spec (PLATONIC_ENGINE_TOPOLOGICAL_MODULE_SPECIFICATION.md). All targets **[GATED]** behind T0.

```txt
T0. ENTRY GATE — named material raises a CONCRETE topological question   [anti-monster: Charter §9, Lieutenant §10]
    - opens ONLY after the minor campaign yields importable named material. Not before.

T1. IMPORT -> LABELLED CELL COMPLEX                 [spec §1, §3, req 1–2]            [OPEN]
    - named material becomes a labelled cell complex; 0/1/2/higher cells carry
      names/concepts/dwellings/source-signatures/relations. Named, not anonymous.

T2. TOPOLOGICAL OPERATION SET                       [spec §4, req 3]                  [OPEN]
    - glue · cut · identify · fold · quotient · thicken · puncture · collapse · subdivide ·
      cylinder · torus · cover · boundary-extract · seam — each as a transform of the complex.

T3. THE CORRESPONDENCE / TRANSFORMATION LEDGER  (CENTRAL ARTIFACT)  [spec §5, req 4, 6] [OPEN]
    - per named item: survived / identified / duplicated / became-boundary / became-seam /
      collapsed / became-loop / orientation-reversed / adjacency-changed.
    - This ledger IS the mechanism that satisfies the inheritance rule (no false identity).

T4. CARDINAL DISCIPLINE — STRUCTURAL FIRST, SEMANTICS LATER  [spec §6, req 5]         [OPEN]
    - record the topological FACT; assign NO meaning (co-location != identity, Ground Plan §4.5).

T5. LEDGER FAITHFULNESS / VALIDITY  (the "is it complete & honest?" proof)  [Ground Plan §5.4 trace law] [OPEN-INFERRED]
    - the ledger must be provably complete (every cell tracked) and faithful (a destructive
      test: strip labels -> ledger reflects it). The major campaign's Gate-0-grade validity
      target before the semantic layer trusts it. [INFERRED from standing audit discipline.]

T6. FIRST PROVING OBJECT — cuboctahedron square     [spec §7]                         [OPEN]
    - square -> cylinder (one edge-pair) and -> torus (both pairs: 4 corners -> 1 vertex-class,
      2 edge-pairs -> 2 loop-classes), with full ledger. Well-supported: the square is a face of
      the proven G2/A3 hub. The concrete first proof, analogous to the legibility proving event.

T7. HANDOFF TO THE SEMANTIC LAYER                   [spec §1, §6, §9]                 [OPEN]
    - the ledger is structured so the semantic interpreter can read it. The boundary to the
      next horizon (below).
```

---

## BEYOND THE TWO CAMPAIGNS  (named in the repo as horizon — NOT a campaign; no invented targets)

```txt
- SEMANTIC INTERPRETATION LAYER: reads the ledger and decides fusion / aliasing / equivalence /
  enforced-adjacency / conflict / rejection (Topo spec §6; Ground Plan naming/semantic layers).
- CONCEPTUAL-CARTOGRAPHIC LAYER: higher organization of concepts/traces (Ground Plan §4.6 —
  "do not build until lower layers have real use pressure").
These complete the North Star. They are deliberately unspecified; do not design them ahead of pressure.
```

---

## Critical path — what actually REMAINS to hit (compressed)

```txt
MINOR (in dependency order, reconciled to Gates F->G->H->I + the bridge):
  1. M3  CLOSE the human-fruit test (old D4)            — decisive; currently DECLINED/open
  2. M3  fold the found generality into the reading
  3. M4  build the display/UI surface for the honest reading
  4. M5  build the human naming workflow (produces the NAMED material)
  5. M6  run ONE bounded portability test
  6. M1  verify end-to-end honest signing (no tuple-as-signature lie reaches export)
  7. M7  design + build select/lift of a named subcomplex with provenance  (THE BRIDGE)

MAJOR (gated on M7):
  T0 entry on named-material pressure -> T1 labelled complex -> T2 operations ->
  T3 the LEDGER (heart) -> T4 discipline -> T5 faithfulness proof -> T6 cuboctahedron-square
  proof -> T7 handoff to semantics.

HONEST IGNORANCE: M7's mechanism and T5's exact form are not specified in the repo; they are
named needs, not designs. The semantic + cartographic layers beyond are horizon only.
```

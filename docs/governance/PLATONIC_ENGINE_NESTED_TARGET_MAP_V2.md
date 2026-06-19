# PlatonicEngine — Nested Target Map v2 (Whole Campaign)

Author: mothership, 2026-06-16, branch `team-arman`. **Supersedes** `PLATONIC_ENGINE_NESTED_TARGET_MAP.md` (commit `60606a4`, 2026-06-14), whose minor half went stale within ~18 hours of being written and is in places factually wrong against the current tree. The error ledger that retired it is §8. This document and its companion `PLATONIC_ENGINE_MAJOR_CAMPAIGN_NESTED_MAP.md` are the planning layer for the campaign we are now entering — written for ourselves and for every agent recruited into the major campaign, not for a future seat.

Discipline carried from v1: **targets are not campaigns**; every node cites repo code / commit / doc / proven result; where the repo is silent a node is marked OPEN-DESIGN, never filled in. Discipline added: every node carries a **liveness tag**, because a map whose statuses lie is worse than no map.

Status legend: **[BUILT]** in the tree, committed, diagnostic-backed · **[DONE]** satisfied & ratified (no code) · **[SUPERSEDED]** the v1 target was overtaken by built work or a closed verdict · **[CLOSED]** terminal verdict reached (possessed/not-possessed named) · **[DEAD]** a path killed by our own test · **[OPEN]** not yet hit · **[OPEN-DESIGN]** needed, mechanism unspecified in repo · **[GATED]** blocked behind a predecessor · **[LIVE]** the active frontier right now.

---

## 0. How to read this map (provenance and trust)

The v1 map was honest for its hour and then the ground moved under it: the semantic *method* it was built to deliver was killed by experiment the same evening, and over the next two days the general presenter and the witness catalogue were built, the tetra-locked slice retired, and the reading surface wired into the app. v2 reports the tree as it **is** on 2026-06-16, verified against commits and run diagnostics — not against the v1 narrative. Where v2 corrects v1, §8 says exactly where and why, so a recruited agent can trust this document by checking the catch, not by trusting the author.

Three standing authorities govern everything below and never collapse into one: **repo code = what IS**; **the sovereign = direction and the final check**; **this seat = what results MEAN and what is next**. The Event Legibility Pivot Charter governs **what is ALLOWED**; the Ground Plan is the horizon (WHY), not a backlog. `README.md` / `ARCHITECTURE.md` are the stale May-2025 prototype — ignore them.

---

## 1. North star, pipeline, and seats

```txt
NORTH STAR:  a generated world stays INTELLIGIBLE after transformation.   (Ground Plan §12; Charter §0)
             realized as a topological "life-of-concepts" workspace.
PIPELINE:    place concepts on a seed -> generate (ambo) -> read the born sites -> human names ->
             repeat -> topologically transform the named material -> interpret what the transform did.
SEATS:       sovereign (direction, final check) -> mothership (meaning, ratification, scope)
             -> engineer/lieutenant (prompts+audits the implementer) -> implementer (runs the code)
             ‖ researcher (abduction; the sovereign's calibrated chat primary, mothership subagent fallback)
OPSEC:       one repo, two teams. team-arman = ours (canonical). arf*/wgate* = competitor, READ-ONLY,
             and they read us in real time. Seals are hash-committed on-repo, PLAINTEXT off-repo,
             .gitignore-enforced. Gate path+branch+HEAD before any write. Never write an unrevealed
             prediction or in-flight strategy onto the branch.
```

---

## 2. The engine you are standing on (one screen, from the code)

The major campaign inherits this; know it before you plan on it. Data model: an **immutable, accumulative lineage** — each operation emits a whole new `Shape`; the full history is retained; you operate only the *active frontier* (`cellLifecycle.ts`). Born vertices carry `createdBy` (2 parents + source edge), a concatenated label (`AB`→`ABAC`), and a composite lineage packet. IDs are deterministic content hashes.

```txt
OPERATIONS (src/operations/registry.ts registers 2; a 3rd is built but unregistered):
  seed                         tetra | octa | cube   (the only 3 SeedTopology seeds)
  ambo-dissection   [BUILT]    rectify: edge->midpoint; emits parent(historical)+core(all midpoints)
                               +1 residue per source vertex. Geometry-classified over a 7-member
                               topology union (ambo.ts SupportedAmboTopology), lifecycle-gated.
                               Core lineage tetra->octa->cuboctahedron->rhombicuboctahedron(terminal);
                               sq-pyramid->rectified->...-ambo-core(terminal). Opposite = host cell's
                               source vertices minus the 2 parents. Host = the source edge's unique parent cell.
  pyritohedral-diagonalization [BUILT]  cuboctahedron core -> pyritohedral-icosahedron. Births NO vertices;
                               splits the 6 squares by a coherent diagonal matching (perfect vertex
                               matching, brute-forced 2^6, deterministic). Diagonals tagged construction-diagonal.
  dualization       [BUILT, UNREGISTERED]  pyritohedral-icosahedron -> dodecahedron dual. Its real product is a
                               SemanticDualModel: a COMPLETE BIDIRECTIONAL correspondence
                               (sourceFace<->dualVertex, sourceVertex<->dualFace, sourceEdge<->dualEdge,
                               one-to-one enforced). Surfaced as an inspection OVERLAY, not a generation.
                               >> This is the already-built ancestor of the major campaign's ledger (see Doc 2, T3).

INSPECTION / WITNESS LAYERS (read-only over engine output):
  topologySignature.ts   per-cell fingerprint, frontier grouping, ambo-readiness, ambo preview
  atomicRegistry.ts      birth-law witness: edge-mediation + face-local projection toward each
                         incident triangle's opposite vertex (Ground Plan §4.4)
  dualView.ts            the dual/correspondence layer — proxies a dual for the WHOLE ambo family
  diagonalizationMatrix.ts  per-square 2x2 verification of the pyritohedral diagonal choice

LIVE SEMANTIC SURFACES (the minor campaign's actual deliverable):
  generalSitePacketPresenterV0.ts   per-site FACE (parents, read-across complement, name slot) + walled TRACE
  siteWitnessCatalogueV0.ts         the MEAT: residual(shed=symmetric difference), abstraction gradient,
                                    named adjacency, gems(octa->antipodality, cuboct->A3/S4), site<->gem merge
  honestSourceStateReadingV0.ts     the CLOSED, tetra-locked Station IV-B field-free reader (banked W-1)

DEAD-BUT-PRESENT (the incomplete corpse-ectomy — standing-authorized hygiene):
  ~60 field*/fano*/moufang*/mixedLoop*/medialCarrier*/structuredSourceState* lib files, AND residual
  field-atlas STATE still inside geometryStore.ts. Removal was UI-sidebar-deep, not store-or-lib-deep.
```

---

## 3. Campaign state by fate (the archive in one screen)

Organize the archive by what *happened to each path*, not by date. This is the orientation a recruited agent needs to not re-fight a closed war.

```txt
THE GRAND DEATHS (chased to the bottom, buried by our own test — do NOT reopen):
  THE FIELD            CLOSED: a carrier/fiber observable field is ABSENT, scoped to first-birth topology
                       & tested channels (NOT absolute). The G2+ higher-form frontier is the one door left ajar.
  OCTONION / FANO      DEAD (K6): the cuboctahedron's 7 axes are an asymmetric 4+3 = K4 + its 3 perfect
                       matchings (V4 / A3-S4), NOT a Fano plane. "7=7" was numerology. Engine is octonion-free.
  HIGHER-FORM ASSOC.   CLOSED-TRIVIAL at first-birth (even-parity coboundary on a 3-ball that holds one bit).
  SEMANTIC METHOD      DEAD (Trisonized Midwife): a blind 3-arm experiment found it DECORATION (A~=B);
                       the bare STRUCTURE is the lift. Survives only as an optional procedure, never per-site content.

BANKED POSITIVES (the thin true line that outlived the deaths — what we actually OWN):
  W-1 source-state legitimacy (defined signed holonomy on the 280 off-Q loops); source-state generality D3
  (gauge-invariant across 168 labelings); the CHANNEL THEOREM (non-associativity cannot be a loop holonomy —
  it is a 3-cocycle, not 1-D transport; breach-immune math); the general engine + general presenter;
  the site witness catalogue (the structural meat); and the discipline of ending on an honest NEGATIVE.

CRISES, AND WHAT HARDENED FROM THEM:
  generalizability crisis -> the Event Legibility Pivot (the generated SITE is the center, not the field).
  seal-custody breach (W2B) + remote-exposure (W2C) -> seal discipline (plaintext off-repo, .gitignore-enforced,
  no shared-history rewrite) + the repo-identity gate (path+branch+HEAD; decoy C:\Dev\PlatonicEngine is NOT us).

STANDING LIVE LAW (the clauses still binding — distinct from the spent field machinery of the same charter):
  the generated site is the center (Charter §4); semantic honesty — candidate-not-truth, no auto-naming,
  return unsupported (Charter §5/§11/§15; Ground Plan §5.5/§5.6); the ANTI-MONSTER GATE for topology
  (Charter §9 — no topology branch begins from capability, only from named-material pressure);
  co-location is NOT identity (Ground Plan §4.5; Topo spec §6); repo = authority for state (Charter §14).
```

---

## 4. MINOR CAMPAIGN — hand the major campaign clean, named, importable material

**Ultimate end (unchanged from v1):** clean, named, honestly-signed material the topological module can import. **What changed:** the deliverable is no longer a Trison excavation-prompt packet (that method is DEAD); it is the **minimal FACE (human worksheet) + walled TRACE (the witness catalogue meat)**, and most of the substrate is now BUILT. The campaign is at its capstone (M7), not its middle.

```txt
M1  SOURCE-STATE TRUTH, HONESTLY SIGNED            [DONE — residual now MOOT]
    hubLayerSourceStateCapsuleV0 proven source-state-real (D1) + general across the hub (D3).
    v1's residual ("no tuple-as-signature lie reaches export") was a FIELD-era concern; the export is
    now the FACE+TRACE, which carries no source-signature tuples. The residual no longer bites.

M2  THE FIELD                                      [CLOSED — not merely "demoted"]
    v1 marked this "demoted to honest witness (IV-A)". Stronger now: the whole field campaign CLOSED
    (W-gate, higher-form terminal verdict), field ABSENT/scoped, channel theorem banked. The honest
    reader remains as a closed, tetra-locked artifact; it is NOT the live reading surface (see M3/M4).

M3  HONEST, LEGIBLE GENERATED-SITE READING         [BUILT — was [PARTIAL]]
    generalSitePacketPresenterV0 (6da2c42) renders, for EVERY ambo site at EVERY generation for ANY
    seed, the minimal FACE (born-between parents; read-across complement; name slot) + a walled TRACE.
    FACE_FORBIDDEN_TOKENS guards against machinery/dead-campaign vocabulary. namingDecision is always
    null (human is sole namer). v1's two open sub-targets are retired: "fold in the found generality"
    was a field-era idea (those witnesses are closed history, not folded into the FACE); the honest
    reader it cited is the superseded tetra-locked one.

M3F THE HUMAN-FRUIT TEST (Charter §13 / old D4)     [SPLIT: method-version CLOSED, human-version OPEN]
    The blind 3-arm experiment answered the METHOD question: structure+method (A=9) ~= structure-only
    (B=7) >> bare pairs (C=0) -> the method adds nothing, the STRUCTURE carries it. So "does the method
    beat bare structure?" is CLOSED-negative. The Charter §13 question — "does the reading let a HUMAN
    understand something they could not before?" — was tested on LLM reasoners, not a human, and remains
    genuinely OPEN. Do not conflate them (v1 did).

M4  DISPLAY / UI SURFACE                            [BUILT — was [PARTIAL]; v1 here is factually wrong]
    The clean per-site FACE and the witness TRACE are wired into the live Selection panel
    (Panels.tsx:741,747; commits 43b3a94 + ed654cd). v1's "not yet the product surface" is false now,
    and its cited "FieldCue display" was REMOVED in the corpse-ectomy (b132b02). The READING surface
    exists; the NAMING workflow (M5) does not.

M5  HUMAN NAMING WORKFLOW                           [OPEN — the genuine remaining minor target]
    Human names / rejects / suspends / revises a site's dwelling WITH STATUS (candidate/confirmed/
    rejected/suspended), never auto-truth (Charter §11; Ground Plan §5.6). Presenter exposes the FACE;
    no capture/status/propagation workflow exists yet. M5c LABEL PROPAGATION (a named site fills its
    neighbours' FACE slots; primals->children->next generation) survives from v1 as a real dependency —
    reframed off the dead excavation prompt onto the FACE's named-neighbour slots. THIS produces the
    named material the bridge lifts.

M6  GENERALITY + BOUNDED PORTABILITY               [BUILT — was [PARTIAL]; v1 here is the slip-1 error frozen]
    v1 said the reading layer is "still typed not-general/untested (generatedSiteReadingV0.ts)" with a
    portability test still owed. Corrected: the tetra-locked slice was RETIRED (168b35c), the general
    presenter built over applyAmboDissection, host resolution made edge-match-only for full
    multi-dissection generality, and M6 DEPTH FIXTURES added (454bb8e: tetra g1/g2 + octa + cube,
    complement sizes 2/4/6). The 'untested'/'do-not-generalize-beyond-one-ambo-tetrahedron' strings still
    in generatedSiteReadingV0.ts are the OLD reader's tombstone, not the live layer. Portability is
    demonstrated, not owed.

M7  IMPORT / HANDOFF READINESS  (THE BRIDGE)       [OPEN-DESIGN — the minor campaign's capstone]
    Named, signed, legible material must be SELECTABLE and LIFTABLE as a "named subcomplex with
    provenance" — the topological module's input (Topo spec §8 req 1-2). v1 said the mechanism is
    "NOT specified anywhere in the repo"; corrected: it is unspecified BUT not ancestor-less — the
    read-only dual correspondence (dualView.ts / SemanticDualModel) is named in Ground Plan §3.2 as the
    designated import source, and "imports begin as snapshots/provenance." Lift from that, do not invent.

TWO SEALED INPUT-VERIFICATIONS  (sovereign-ordered, BEFORE M7)   [LIVE — awaits mothership audit]
    (a) composition / gluing rule — settled STRUCTURALLY (closes into the S4-incidence geometry of K4);
        the ENGINE-REALIZATION across generations is owed, sealed-not-asserted.
    (b) confluence-distribution — characterize the quotient-seed (each midpoint sits in 3 cells: core +
        two endpoint-residues) across sites/generations.
    Routed to the calibrated researcher; off-repo seals. W4 closure-growth is DEAD (computed: decides
    nothing). When results return, AUDIT in code — do not ratify on the report.
```

---

## 5. MAJOR CAMPAIGN — the topological module (gated; detailed in the companion zoom)

**Ultimate end (unchanged, sound in v1):** named ambo/dual material transformed topologically, with a complete, faithful **correspondence ledger**, ready for the semantic layer. Decomposition from `PLATONIC_ENGINE_TOPOLOGICAL_MODULE_SPECIFICATION.md`. All targets **[GATED]** behind T0. The detail lives in `PLATONIC_ENGINE_MAJOR_CAMPAIGN_NESTED_MAP.md`; the spine:

```txt
T0  ENTRY GATE — named-material pressure opens it; capability never does (anti-monster, Charter §9)   [GATED]
T1  IMPORT -> LABELLED CELL COMPLEX        named, not anonymous (spec §1,§3)                           [OPEN]
T2  TOPOLOGICAL OPERATION SET              glue/cut/identify/fold/quotient/.../torus (spec §4)         [OPEN]
T3  THE CORRESPONDENCE LEDGER (the heart)  per item: survived/identified/duplicated/became-boundary/   [OPEN]
                                           seam/collapsed/loop/orientation/adjacency (spec §5)
                                           >> ANCESTOR EXISTS: SemanticDualModel is a working
                                              bidirectional ledger between two labelled complexes.
T4  STRUCTURAL FIRST, SEMANTICS LATER      record the topological FACT; assign no meaning (spec §6)     [OPEN]
T5  LEDGER FAITHFULNESS PROOF              complete + faithful (strip labels -> ledger reflects it)     [OPEN-DESIGN]
T6  FIRST PROVING OBJECT — cuboctahedron square -> cylinder/torus, full ledger (spec §7)               [OPEN]
T7  HANDOFF TO THE SEMANTIC LAYER          ledger structured for the interpreter (spec §1,§6,§9)        [OPEN]
```

**Beyond (horizon, not a campaign — invent no targets):** the semantic interpretation layer (reads the ledger: fusion/aliasing/equivalence/enforced-adjacency/conflict/rejection) and the conceptual-cartographic layer (Ground Plan §4.6 — do not build until lower layers have real use pressure).

---

## 6. The order of battle (corrected critical path)

```txt
NOW (LIVE):   two sealed input-verifications -> MOTHERSHIP AUDIT in code -> dispose.
THEN:         M7 the bridge — engineer calibrates the open-design lift (anchored on the dual-correspondence
              ancestor + snapshot/provenance, Ground Plan §3.2); mothership RATIFIES; then audits the diff.
GATE:         T0 opens the major campaign ON the bridge's importable object — never before (anti-monster).
THEN:         T1 labelled complex -> T2 operations -> T3 the LEDGER (heart) -> T4 discipline ->
              T5 faithfulness proof -> T6 cuboctahedron-square proof -> T7 handoff to semantics.
STANDING (no new ruling needed):  field corpse-ectomy (lib + store), exact-path, audited, native-verified;
              cube->antipodality gem if it serves (rest of gem-extension DEFERRED — needs the witness defined upstream).
OWED:         native commit of the planning layer (these two maps, the spec, the engineer initiation, the
              rulings/closing memos, the mothership initiation) to docs/governance/ on a GATED team-arman.

OPEN, GENUINELY (do not pretend otherwise): M5 naming workflow; the two verifications' result; M7's lift
              mechanism and T5's faithfulness form (open-design); the human-version of the human-fruit test;
              the G2+ higher-form frontier (closed by choice, reopenable only by the sovereign).
```

---

## 7. The minor campaign's spent zoom

The v1 companion `PLATONIC_ENGINE_MINOR_CAMPAIGN_NESTED_MAP.md` zoomed into the minor campaign through the **Trisonized Midwife excavation prompt** — a method killed the same evening it was mapped. That zoom is **retired**: its subject is dead and the minor campaign it detailed is built. Its forward-equivalent — the detailed zoom into the campaign that is actually live — is `PLATONIC_ENGINE_MAJOR_CAMPAIGN_NESTED_MAP.md`. The minor campaign's completed state is recorded in §4 above; it needs no separate live zoom.

---

## 8. What changed from v1 (the error ledger — so you can trust this by checking, not believing)

```txt
v1 NODE / CLAIM                         v2 CORRECTION                                    EVIDENCE
M3 "[PARTIAL]" honest reader            BUILT as the GENERAL presenter; honest reader    6da2c42; honestSource* is
   is the reading surface               is the SUPERSEDED tetra-locked artifact          tetra-locked (M_AB..M_CD)
M4 "not yet the product surface"        FALSE — FACE+TRACE wired into Selection panel    Panels.tsx:741,747; 43b3a94, ed654cd
M4 cites "FieldCue display"             that UI was DELETED in the corpse-ectomy         b132b02
M6 "reading layer typed not-general/    SLIP-1 ERROR FROZEN — tetra-lock retired, general 168b35c; 6da2c42; 454bb8e
   untested; portability test owed"      presenter built + proven on tetra/octa/cube      (M6 depth fixtures)
M2 "demoted to honest witness"          UNDERSTATED — the field campaign CLOSED entirely  W-gate + higher-form closings
M1 residual "tuple-as-signature lie"    MOOT — post-field export is FACE+TRACE, no tuples post-field deliverable
M7 "mechanism nowhere in the repo"      has a NAMED ancestor: dual correspondence         Ground Plan §3.2; dualView.ts
critical path (M3->M4->M5->M6->M1->M7)  WRONG ORDER — M3/M4/M6 BUILT; frontier is the     commits above; turn-to-M7 ruling
                                        two sealed verifications -> M7 (no v1 node for them)
ENTIRE MINOR-ZOOM companion             its subject (Trison excavation prompt) is DEAD    67fb59a; experiment report
                                                                                          .handoff/REPORT_experiment_round2 (A~=B)
```

The major-campaign half of v1 (T0–T7), the north star, and the horizon were sound and are carried forward corrected only by connecting T3 to its existing ancestor. The rot was confined to the minor half — which is exactly where the work had moved fastest while the map stood still.

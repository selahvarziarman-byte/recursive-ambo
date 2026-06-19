# PlatonicEngine — Engineer / Prompter Seat Calibration Submission

## The builder reports the substrate as he found it, the build plan for Target 1, and his smallest first prompt — before any build prompt is sent

Audience: mothership (ratifying authority); Arman (sovereign). For the researcher's awareness.

Status: **Engineer-seat calibration submission — NOT a build, NOT a committed diff, NOT a build authorization.** Per Initiation §7.3 I report my reading of the substrate, my Target-1 plan, and the single smallest first prompt, and I HOLD: I send no implementer prompt and commit nothing until the mothership ratifies this and hands me the ratified Target-1 spec. Nothing is staged. The seat is at rest.

Repo identity (mandatory preamble): canonical `C:\Dev\202cl\PlatonicEngine202`, branch `team-arman` (gated and confirmed this session). Decoy `C:\Dev\PlatonicEngine` is NOT this project; `arf*` / `wgate*` are a read-only competitor.

Issued: 2026-06-19. By: engineer/prompter seat candidate, on the Engineer/Prompter Seat Initiation (2026-06-19).

---

## 0. What I did this session (calibration hygiene, not a claim for credit)

Read first-hand, end to end: `src/types/geometry.ts`, `src/lib/ids.ts`, `src/lib/ambo.ts`, `src/lib/dualization.ts`, `src/lib/atomicRegistry.ts`, `src/lib/siteWitnessCatalogueV0.ts`; the two modules my targets stand on, `src/lib/generalSitePacketPresenterV0.ts` (Target 1 reads it) and `src/lib/pyritohedralDiagonalization.ts` (Target 1's GlobalSquareResolution source); the diagnostic template `scripts/diagnose-site-witness-catalogue-v0.cjs`; `src/lib/diagonalizationMatrix.ts` and `scripts/diagnose-atomic-registry.cjs` to fix the scope delta; `package.json`.

Ran the §7.2 proof: `node scripts/diagnose-site-witness-catalogue-v0.cjs` → **ALL PASS**. The build+prove loop is live and I have seen it work.

I independently verified the one headline number I intend to seal into a prompt (§5 of the seat doctrine — never seal a value you are only told): a throwaway, read-only enumeration over the cuboctahedron core's 6 square faces (2⁶ masks, perfect-vertex-matching + diagonal-not-an-existing-edge, mirroring `selectCoherentDiagonalMatching`) returns **exactly 2** coherent matchings. The throwaway script was deleted; the working tree is clean of it.

---

## 1. (a) The substrate, in my own words — cited to lines I read this session

```txt
DATA MODEL (geometry.ts).  Immutable/accumulative: every op returns a new Shape; nothing mutates.
  Vertex.createdBy = {operation, sourceVertexIds, sourceEdgeId?, sourceFaceId?, sourceCellId?}.
  Cell = {kind: seed|parent|core|residue, topology?, generationDepth, parentCellId, vertexIds,
    faceIds, sourceVertexIds, sourceEdgeIds, preservedVertexId?, lineage?}.
  Face = {vertexIds, role, sourceCellId?, sourceFaceId?, sourceVertexId?, lineage?}.

IDS (ids.ts).  stableHash = FNV-1a -> base36 (L12-21). canonicalEdgeKey sorts the pair (L23-25).
  makeMidpointVertexId(parentCellId, a, b) = hash(parentCellId | midpoint | edgeKey) (L39-41) —
  CELL-KEYED. This hash IS the registry's "scope": a site's identity is scoped to its host cell.

AMBO (ambo.ts) — the lineage spine.  Per source edge, one midpoint (L89-121): sourceVertexIds=[a,b],
  sourceEdgeId set, label = parentA.label + parentB.label (L110), keyed on sourceCell.id (L91).
  Emits parent husk + core (all midpoints) + one residue per source vertex. THE KEY FACT for Target 1:
  core faces come in TWO flavors —
    - face-derived: role 'dissection-core-face', sourceFaceId set (L510-515) — TRIANGLES for tetra/octa;
    - vertex-derived: role 'dissection-core-face', sourceVertexId set, NO sourceFaceId (L521-527) —
      the SQUARES at degree-4 source vertices (the 6 squares of a cuboctahedron core).

PRESENTER (generalSitePacketPresenterV0.ts).  buildGeneralSitePacketPresenterReport(shape) -> per-site
  packets {trace.siteId, parentIds, hostCellId, complementVertexIds, generationDepth}; host resolved
  uniquely by sourceEdgeId -> the one parent cell whose sourceEdgeIds contains it (L130-150). This is
  the per-site spine Target 1 consumes; "scope x lineage" = (host cell) x (parents/label).

PYRITOHEDRAL (pyritohedralDiagonalization.ts) — the GlobalSquareResolution.
  selectCoherentDiagonalMatching (L239-277): brute-forces 2^6 over 6 squares, each square's 2 diagonals
  from getSquareDiagonalChoices (L279-302); keeps a mask iff isPerfectVertexMatching (each of 12 verts
  hit once, L304-314) AND no chosen diagonal coincides with an existing edge (L255); then PICKS the
  lex-lowest valid matching (L264-266). It picks one; it never asserts the count.

DUAL (dualization.ts) — Target 2's ledger ancestor.  SemanticDualModel = six maps
  (sourceFace<->dualVertex, sourceVertex<->dualFace, sourceEdge<->dualEdge) with the bijection ENFORCED
  (throws on non-1-to-1: mapDualEdges L355-380, buildDualEdgeMetadata L753-761).

TEMPLATES.  Module: siteWitnessCatalogueV0.ts — pure fn over a Shape, typed report with issues[],
  mutates nothing, names nothing. Diagnostic: diagnose-site-witness-catalogue-v0.cjs — ts.transpileModule
  require-hook, require the REAL engine by path (createSeedShape from src/data/seeds.ts L75,
  applyAmboDissection), build fixtures, assert ratified numbers, print PASS/FAIL, end ALL PASS.
  Build gate: npm run build = tsc -b && vite build (package.json L8).
```

---

## 2. The scope delta for Target 1 — read the core before claiming it (doctrine §2)

The registry is **not** a redundant cage around something already general. I checked the three nearby modules and the gap each leaves is exactly what the registry fills:

```txt
atomicRegistry.ts        PER-VERTEX, TRIANGLE-ONLY. Recovers triangular face contexts by filtering
                         role=='dissection-core-face' && Boolean(sourceFaceId) (L172-179) — so it
                         KEEPS the face-derived triangles and DROPS the vertex-derived squares (which
                         carry sourceVertexId, not sourceFaceId). On a cube/square midpoint it returns
                         'non-triangular-context' (diagnostic L162-172). This IS the square-blindness,
                         mechanically. Its supported reading 'edge-mediation-with-face-local-projection'
                         with projection apex = the triangle's third vertex (L236-246) IS Trace-tri.

diagonalizationMatrix.ts PER-SQUARE 2x2: AC/BD = the two candidate diagonals, chosenEntry/alternateEntry
                         (L256-257) = the 2 candidate apexes. BUT it resolves only via an ALREADY-APPLIED
                         pyritohedral child cell (L93-102) — post-resolution, never pre-resolution.

pyritohedral...ts        PICKS one coherent matching (lex-lowest); does not enumerate or COUNT them.
```

So Target 1 is genuinely additive: one read-only, **pre-resolution** certifier over a Shape that (i) reproduces Trace△ one-for-one with the atomic registry's supported mediation reading, (ii) adds the square half the atomic registry refuses — Trace□ / Coh□, the two-candidate-apex with resolution **deferred** to (iii) the GlobalSquareResolution policy layer, which enumerates and asserts the coherent matchings exist and number **2**, plus GlueCoh manifold-sanity. Modeled on `siteWitnessCatalogueV0.ts`'s module shape exactly.

**Held for the spec (not mine to invent):** the registry report's exact type/field names; the precise statement of the "square-blindness measurement"; whether the primary loop is per-site with GlobalSquareResolution as a policy layer (the Initiation §1 phrasing, which I am assuming) or resolution-first. These are definition, not mechanism — I build them to the ratified spec, I do not choose them.

---

## 3. (b) Build plan for Target 1 — `incidenceTraceRegistry.ts`

```txt
FILES (additive only):
  src/lib/incidenceTraceRegistry.ts                      (the certifier — sibling of siteWitnessCatalogueV0)
  scripts/diagnose-incidence-trace-registry.cjs          (the proof — sibling of the v0 diagnostic)
  package.json: + "diagnose:incidence-trace-registry"

FIXTURES (the proven path): createSeedShape('tetrahedron') -> applyAmboDissection (octahedron core, gen-1)
  -> applyAmboDissection on the octa core (cuboctahedron core, gen-2). Same two-shape ladder the v0
  diagnostic already trusts.

SEALED NUMBERS the diagnostic must reproduce (those I am certain of today):
  - GlobalSquareResolution: coherent perfect-matchings on the cuboctahedron core = 2  (I verified this
    read-only this session); squares=6, triangles=8, cell edges=24, vertices=12.
  - Trace△ one-for-one: for each tetra-g1 midpoint the registry's triangle-mediation reading equals
    buildAtomicRegistryReport's supported reading (2 triangular contexts for a tetra-g1 midpoint;
    atomic-registry diagnostic L63-67).
  - Square-blindness: every cuboctahedron-square midpoint that the atomic registry rejects as
    'non-triangular-context' is the set the registry serves with Trace□ instead.
  (Any count I cannot yet pin from the engine — e.g. the spec's exact square-blindness scalar — prints
   for eyeballing rather than being sealed against a guess, per doctrine §5.)

SEQUENCE (one target per prompt; smallest falsifiable increment first):
  P1  scaffold + GlobalSquareResolution layer, sealed at =2  (the §4 prompt below).
  P2  Trace△ port, sealed one-for-one against buildAtomicRegistryReport.
  P3  Trace□ / Coh□ (two candidate apexes per square, resolution deferred to the P1 layer) + GlueCoh.
  P4  assemble per-site report (carried identity scope x lineage) + issues[]; diagnostic to ALL PASS;
      audit; hand the exact-path commit up.
```

---

## 4. (c) The single smallest first prompt I would send the implementer

A self-contained contract: it builds only the most-falsifiable, most self-standing piece (the resolution layer the deferred square-trace points at), seals the one number I have personally verified, and touches nothing else. It is subordinate to the ratified spec — if the spec shapes the module differently, I revise before sending.

```txt
TO: implementer (Claude Code), branch team-arman.

0. GATE. Confirm `git rev-parse --abbrev-ref HEAD` == team-arman and that
   src/lib/incidenceTraceRegistry.ts does NOT yet exist. If either fails, STOP and report.

1. GOAL. Create the scaffold of the incidence-trace & square-coherence registry and ONE member of it:
   the GlobalSquareResolution layer — a pure, read-only enumerator of the coherent square-diagonal
   matchings of a cuboctahedron-topology cell. No per-site Trace members yet.

2. FILES — create only these; additive only:
   - src/lib/incidenceTraceRegistry.ts
   - scripts/diagnose-incidence-trace-registry.cjs
   - package.json: add "diagnose:incidence-trace-registry": "node scripts/diagnose-incidence-trace-registry.cjs"
   FORBIDDEN to touch: ambo.ts, pyritohedralDiagonalization.ts, atomicRegistry.ts, diagonalizationMatrix.ts,
   dualization.ts, generalSitePacketPresenterV0.ts, types/geometry.ts, the store, any component.
   Do not import from or modify any of them except `import type` from types/geometry.ts.

3. WHAT TO BUILD (model the module shape on src/lib/siteWitnessCatalogueV0.ts — pure fn over a Shape,
   typed report with an issues[] array, mutates nothing, asserts no names):
   - export interface GlobalSquareResolution { cellId; squareCount; coherentMatchingCount; matchings: {diagonalKeys: string[]}[] }
   - export interface IncidenceTraceRegistryReport { methodId: 'incidence-trace-registry-v0';
       squareResolutions: GlobalSquareResolution[]; issues: string[] }   // per-site members come later
   - export function buildIncidenceTraceRegistry(shape: Shape): IncidenceTraceRegistryReport
   For each cell with topology 'cuboctahedron', read its faces (those whose id is in cell.faceIds),
   take the six 4-vertex faces; for each square (a,b,c,d) the two diagonals are {a,c} and {b,d} keyed by
   canonicalEdgeKey; enumerate 2^(#squares) masks; keep a mask iff (i) each of the cell's vertices is hit
   exactly once by the chosen diagonals AND (ii) no chosen diagonal key equals an existing cell-edge key
   (collect cell-edge keys from the sides of all the cell's faces). coherentMatchingCount = count kept.
   This RE-DERIVES selectCoherentDiagonalMatching's search read-only — do NOT call the pyritohedral module.
   Honesty: if a cuboctahedron cell yields !=2 coherent matchings, do not coerce — record it in issues[]
   and report the real count.

4. DIAGNOSTIC (copy the harness of scripts/diagnose-site-witness-catalogue-v0.cjs exactly: the
   ts.transpileModule require-hook; require the REAL src/lib/incidenceTraceRegistry.ts (the anti-mock guard),
   createSeedShape from src/data/seeds.ts, applyAmboDissection from src/lib/ambo.ts). Fixtures:
   s1 = applyAmboDissection(createSeedShape('tetrahedron'));
   s2 = applyAmboDissection(s1, <the gen-1 octahedron core cell id>);
   Build the report on s2 and SEAL:
   - exactly one cuboctahedron squareResolution is present;
   - squareCount === 6;
   - coherentMatchingCount === 2;     // sealed: verified by independent read-only enumeration
   - issues is empty.
   Print PASS/FAIL per check and end in 'ALL PASS' / 'N FAILURE(S)' with the matching process.exit.

5. PROVE: `npm run build` must pass tsc clean; `node scripts/diagnose-incidence-trace-registry.cjs`
   must print ALL PASS.

6. STOP — do NOT stage or commit. Return the full diff and `git status --short`. I audit and run the
   diagnostic myself before anything is committed.
```

---

## 5. What I am NOT doing, and my request

I am sending no implementer prompt, committing nothing, building neither certifier, and not touching the gated transformation operations (glue/cut/quotient are not mine). Per §7.3 I hold for ratification.

I request, before I send prompt P1:

```txt
(i)   ratification of the §1-§2 reading of the substrate and the Target-1 scope delta (the registry as the
      pre-resolution, read-only unifier of Trace△ + the square half + GlobalSquareResolution), or its correction;
(ii)  the ratified Target-1 spec itself — it is not in the repo (.handoff/ holds only the older step-2 /
      witness-trace prompts; no incidence-trace or ledger spec is tracked), so I need it handed to me to pin
      the report's exact shape, the precise "square-blindness measurement", and the per-site-vs-policy ordering;
(iii) confirmation that P1 (scaffold + GlobalSquareResolution sealed at =2) is the right smallest first slice,
      or a redirect to the Trace△ port first.
```

On ratification and receipt of the spec, I send P1 exactly as drafted (adjusted to the spec), audit the return against the real artifact, run the diagnostic myself, and hand you the exact-path commit. Nothing is staged; the seat is at rest.

— engineer / prompter seat candidate, 2026-06-19, branch `team-arman`

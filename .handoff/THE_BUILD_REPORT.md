to: the mothership (sixth)
from: the coder
**STAMP `B-118` — ECHOED.** ⛔ **Two measurements, no build, and I have stopped.**

# 1 · §4.1 — THE STEMMA'S PRICE

> ### ✅ **HER ONE UNVERIFIED PREMISE IS FALSE — IN THE GOOD DIRECTION. `genesis.reducedEdges` CARRIES THE OPERATION.**

**The type, `src/lib/genealogyDag.ts:75-81`, verbatim:**
```ts
export interface GenealogyEdge {
  parent: ShapeId;
  child: ShapeId;
  operation: OperationKind; // the child's birth operation
  death: boolean;
  U?: 1 | -1;
}
```
✔ **And the reduction does not strip it: `transitiveReduceEdges` (`src/playground/genealogyLayout.ts:27-37`) is a pure `dag.edges.filter(…)` — it returns THE SAME EDGE OBJECTS.** ⇒ **`operation` survives to `reducedEdges` intact.**

⚠ **HER CITATION VERIFIED RATHER THAN ASSUMED, and it is exact.** `ManuscriptView.tsx:4087` **is** `stemmaLines`, and her description of it is right to the field:
```ts
return genesis.reducedEdges
  .map((edge) => {
    const from = homeOfShapeId.get(edge.parent);
    const to = homeOfShapeId.get(edge.child);
    return from && to ? { key: `${edge.parent}->${edge.child}`, from, to } : null;
  })
```
> ### ⇒ ⛔ **`edge.operation` IS ALREADY IN SCOPE ON THAT VERY LINE. It is simply not carried into the object.** ***The op is not missing from the data; it is dropped at the last step before the draw.***

**THE PRICE, located and not paid:**
| what | where | size |
|---|---|---|
| carry the op | `ManuscriptView.tsx:4093` — one field in the mapped object | **one field** |
| widen the line type | the `filter` predicate's inline type on the same expression | **one field** |
| draw it | `ManuscriptView.tsx:5131-5143` — the sole consumer, a `<Line>` per edge | **the real cost lives here** |

⇒ ★ **THE DATA COSTS ONE FIELD. THE DRAWING IS THE WHOLE PRICE** — the renderer emits a bare two-point `<Line>` with a colour, a width and an opacity, and has no text, no anchor and no mid-point today. **Whatever she wants the op to LOOK like on the edge is the entire question; the op's availability is not a question at all.** ⛔ **I put nothing there.**

---

# 2 · §4.2 — THE DRAG'S SURFACE

⚠ **Her `pageSnapshot.ts:45-47` citation verified — exact.** `WrittenPageEntry` has **exactly three fields**: `form`, `home`, `zooMember?`.

## (a) IS `home` WRITTEN AT RUNTIME AFTER PLACEMENT?
> ### ⛔ **NO. `home` IS WRITTEN ONCE AT PLACEMENT AND THEREAFTER ONLY READ.**
**All 11 `setWritten` call sites, swept:** ten **append** a new entry with a freshly computed `home`; the one that **maps** (`:4680`) rewrites `form` and preserves `home` through the spread —
```ts
cur.map((w) => (w.form.id === entry.form.id ? { ...w, form: result.reshaped } : w))
```
⇒ **There is no runtime rewrite of `home` anywhere. A drag would be the first one.**

## (b) DOES ANYTHING DISTINGUISH PERSON-PLACED FROM ENGINE-PLACED?
> ### ⛔ **NO. HER D.3 IS NEW STATE.**
**`zooMember` is the only placement-adjacent mark, and it means the wrong thing:** it marks *the zoo put this here*, and its two readers are the **serializer's exclusion** (`pageSnapshot.ts:80`) and the **dirty signature** (`pageStore.ts:124`). **It is not provenance of a POSITION.**

**The census of who chose each position, since that is what D.3 is really asking:**
- **THE PERSON chose: 2 sites** — the right-click invoke at the pointer (`:3929`, `invokeMenu.world`) and the shelf drop (`:4880`, `[x, y, 0]`).
- **WE chose: 8** — four op-spawns beside a target (`target.home[0] + spawnOffset`), two zoo slots, the bodiless home, and the combine's midpoint (`(a.home + b.home)/2, min(a,b)−4`).
⇒ ⚠ **So a mark would not be recording something the engine already knows implicitly — 8 of 10 placements are ours, and the person's 2 are not currently distinguished from them by anything.**

## (c) ⛔⛔ IS A MEMORIAL'S SITE THE SAME `home` FIELD? — **THE ONE THAT MATTERS**

> ### ⇒ **IT IS ONE ARRAY READ BY TWO RECORDS. Measured by identity, not by reading:**
```
mark.home === entry.home       → true
act.entry.home === entry.home  → true
after undo, restored entry.home === the original array → true
```
**`removeForm` stores `home: entry.home` — a REFERENCE, not a copy. So today the memorial's site and the form's site are literally the same array object.**

> ### ⛔ **AND WHETHER IT STAYS ONE IS DECIDED ENTIRELY BY WHICH DRAG IDIOM IS BUILT. I simulated both:**
| the drag writes | does the memorial follow? |
|---|---|
| **in place** — `home[0] = x` | ✅ **yes** — one fact, two readers |
| **immutable replace** — `{ ...w, home: [nx, ny, 0] }` | ⛔ **NO — it silently diverges** |

⚠ **AND THE SECOND IDIOM IS THE ONE THIS CODEBASE USES EVERYWHERE** — including at `:4680`, the only existing map over `written`. ⇒ ***The natural drag is the one that breaks it, and it breaks it without an error: the form moves and its memorial stays behind, so a stemma endpoint and a memorial that are the same site today would come apart at the first drag.***

> ### ⇒ **YOUR SIZING QUESTION ANSWERED: it is ONE field today, and the drag decides whether it stays one.** ⛔ **That is why §B.3 (the memorial IS the endpoint) and §A (homes are draggable) do not merely fail to range over each other — they are the two halves of one shared array, and only one of them currently owns it.** **Hers; I designed nothing.**

---

# 3 · WHAT I RAN
- **`npx tsc -b` → exit 0** at HEAD. **No source changed this cycle** — the measurements are reads plus one throwaway identity probe in the scratchpad.
- ⚠ **I did NOT add a witness for these.** **A leg is a build, and you ordered none.** ⛔ **Which means these three answers are unpinned and will rot** — if any of them is going to be leaned on, say so and pinning them is the next cheap thing.

# 4 · ✅ AND I HAVE STOPPED
**Nothing chartered was started. Arman's walk of P5 is the next event.**

★ **On §3's roof: understood, and I am not inventing a title.** ⚠ **One note for when her wording arrives — the roof is a `<span>` inside `RecordStrip` (`ManuscriptChrome.tsx`), and the acts line already sits under it as a sibling with its own `THE ACTS` label. So a new title is one string; if she instead wants two titled registers, that is a small structural change and I would rather know which before I touch it.**

— the coder

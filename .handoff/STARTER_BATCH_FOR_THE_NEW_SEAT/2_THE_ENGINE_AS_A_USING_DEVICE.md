# 2 · The engine, as a device you use

This page teaches the engine from nothing, along the one road you will travel with Arman: **his four seeds → four casts → the seed solid → two dissections → the six squares → the Manuscript.** Things you click or read as labels are in **bold**. Sentences the app prints are in *italics*, so you can find them on the screen.

**✎ marks every place where the device takes something only Arman can give: a name, or a decision about what is the same.** Your work divides at those places. Arman gives the thought, and you make the device take it.

---

## What the engine is for

The engine lets a person set several concepts beside each other on the corners of a solid, say by hand where two of them are the same, and read back what those decisions imply as you go around the solid. Then it lets you take pieces of that solid into a second workspace, **the Manuscript**. There you glue and fold them into surfaces and spaces, and you can walk inside what you built, carrying a concept.

One idea runs through all of it: **what you do to the shape is what you are saying about the concepts on it.**
- Pairing two roles says that they are one.
- Gluing two corners of a square into one point says that those two corners' concepts are one concept, and the surface you get is the record of that decision.

The device keeps the record. It never decides for you, and it never proposes. The seed solid comes with its corners lettered **A B C D**, and until someone names a corner, its letter serves as its name. Everything else the device labels, it labels only so that things can be found: a midpoint reads as its two corners' letters (**AB**, **ABAC**), a square's edges are lettered **a b c d**, and ids such as **face:…** are addresses. None of these is a name someone gave. **Names are the person's to give.**

## Where it is

- In a web browser at **`http://localhost:5173`**. Arman keeps it running.
- Two workspaces, switched at the top: **Ambo Universe** and **Manuscript**. Switching keeps your work. A full reload of the page loses whatever you have not saved (see **Saving**, below).

## The words you will meet

| on the screen | what it means |
|---|---|
| **seed** | two uses: **Arman's four seeds** are his concepts; **Seed shape** (top left) is the solid you start from |
| **cast** | a concept written as a file the device can take (page 3) |
| **role** | one point of a concept: one of the distinct ways it shows up. It is drawn as a dot with its name; where it has no name, the screen shows its id |
| **word** / **relation-type** | a kind of relation a concept uses |
| **relation** / **tuple** | one instance: this word holds (or does not hold) between these roles |
| **space** / **concept-space** | the whole of a concept at a corner: its roles, words and relations |
| **corner** / **vertex** | a point of the solid; the seed solid's four are **A B C D** |
| **packet** | what a corner carries: its **Label**, color, tags, notes, and the cast it holds |
| **midpoint** | a new corner the device makes halfway along an edge when you dissect (**AB** lies between A and B) |
| **generation** (g0, g1, g2) | how many dissections deep you are |
| **cell** / **face** | one solid piece / one flat side of a piece |
| **inspector** | the **Selection** tab: what is selected, with rows for its parts that you can click |
| **pair** | your act at a midpoint: this role of A is that role of B, or this word of A is that word of B |
| **lift** | carrying a chosen piece from the Ambo Universe onto the Manuscript's shelf |
| **shelf** / **page** | in the Manuscript: where lifted pieces wait, and where you place them |
| **3-manifold** | a space with three directions that you can be inside and walk around in. In the Manuscript you build one by gluing a solid's faces to each other in pairs |
| **door** | one such pair of glued faces; you walk through it. Its **key** is its letter, which you press to cross |
| **mark** | a count or a name the device prints about what it holds; never a verdict |

---

## Part 1 · The seed solid and its four corners (Ambo Universe)

1. Top left, **Seed shape**: **Tetrahedron**, a solid with four corners.
2. **Choose a corner.** Click it on the solid. Or open the **Packets** tab on the right, set **Filter** to **All vertices**, and click the corner's card. Below appears the corner's packet: **Label · Color · Tags · Notes · Custom JSON · Save packet** and **load cast… (.cast.json)**.
3. ✎ **The corner's name.** **Label** starts with the corner's letter, and the app counts that letter as the corner's name, so its card says **named**. The name of the concept at this corner is Arman's. Type it over the letter, then press **Save packet**, and his name takes the letter's place. Loading a cast never fills it.
4. ✎ **load cast…**: choose the cast you made from this seed, with Arman's words inside it (page 3).
   - The card answers *taken — N roles · N relation-types · N relations · …*, or a refusal (page 3 says what each one means).
   - Over the solid appears *the inside of the cast it holds*: a drawing of the concept's roles and relations. It stays while that corner is selected. Select something else, such as a cell in the **Workspace** tab, to put it away.
5. Do the same for the other three corners.

Under the solid, one line lists the gestures. It begins *click — select what you point at, on the solid or in the inspector · shift-click — toggle it in the lift region …* and includes *drag — orbit · right-drag — pan · wheel or middle-drag — zoom*. Read it whenever you are unsure.

## Part 2 · The first dissection and the midpoints (generation 1)

1. **Apply Ambo Dissection** (left panel). The tetrahedron is cut into an **octahedron** in the middle (the **core**) and four small tetrahedra at the corners (the **residue**). Six new corners appear at the middles of the edges: **AB, AC, AD, BC, BD, CD**.
2. **Open a midpoint.** In the Packets tab (**All vertices**), click **AB**. When both of its corners hold a concept, the midpoint opens over the solid: *AB · the midpoint between A and B — the two faces unfolded about their edge*. A's roles stand in one column and B's in another, with each side's words in a row above the drawing. If one corner holds nothing yet, the midpoint has nothing to unfold.
3. ✎ **Pairing.** The midpoint says: *two halves, both yours*.
   - **a role**: click a point in A's column, then a point in B's, in the drawing.
   - **a word**: click a word in A's row, then a word in B's, just above the drawing.
   - **withdraw** undoes either.
   - A pair that the record contradicts is *not taken*, and the reason is given.

   Which role of A is which role of B, and which word translates which, is Arman's decision. The device never offers a pair.
4. **What the midpoint tells you:**
   - its own space so far, for example *no pair given yet — A and B stand apart: … roles · … words · … tuples*;
   - the words translated so far, for example *no word translated — every word foreign to the other side, alike spellings included*;
   - under the midpoint's own column, what **each opposite corner** makes of your pairing, for example *C's view of your pairing on A–B* with *agrees on …*, *would pair … otherwise*, *would join what you left apart: …*. These are readings, never buttons.
5. **A face reads** once all three of its edges hold pairs. For the face **A·B·C**, walked in its own direction (A → B → C → A), each role is *returned to itself*, *returned elsewhere*, or *did not return*. Until then the midpoint says what the face still needs, for example *no reading yet — it needs a record on each of its three edges*.
6. ✎ **The midpoint's name.** Each midpoint has a packet of its own, like a corner, with a **Label**. The Packets tab counts them (*unresolved generated midpoint packets*) and steps through them with **Previous unresolved**, **Next unresolved** and **Save and next unresolved**.

## Part 3 · The second dissection (generation 2)

1. Open the **Workspace** tab and click the **octahedron** card, marked **core** and **g1**. The left panel says *Ready to dissect selected octahedron core.* Press **Apply Ambo Dissection**.
2. The octahedron is cut into a **cuboctahedron** (the new core, g2) and six **square pyramids**. New midpoints appear between the first ones: **ABAC, ABAD, …**
3. **The born room.** Open a new midpoint, such as **ABAC**, from the Packets tab. It reads *ABAC · the midpoint between AC and AB* and shows two kinds of thing:
   - what the solid has already made one, for example *… stand on both sides as one — composed, not yours (their points hollow)*;
   - what is left for the person, for example *the born room: 10 roles of AC and 9 of AB stand apart · no pair of yours yet*. Once you pair here, those pairs read *yours, born here*.

   A pair here that would break a pair elsewhere is refused, and both acts are named.
4. ✎ The same acts apply at every new midpoint: pairing roles, translating words, and giving the midpoint's packet its Label.
5. **Seeing inside:**
   - **Explode View** (left panel slider) pulls the cells apart so that inner faces can be reached.
   - **Core cells**, **Residue cells** and **Previous/parent cells** show or hide those groups.
   - **Isolate selected cell** (Selection tab) shows one cell alone.
6. **Going back.** The Workspace tab's **Genealogy** list selects an earlier generation. Dissecting the same cell again returns the one you already had, with your pairs.

## Part 4 · The six squares, and lifting them

1. The cuboctahedron has 14 faces: 8 triangles and **6 squares**. Each square stands where one first-generation midpoint stood. With the cuboctahedron selected, the inspector's rows give every face by its corners. For example: *ABAC·ABBC·ABBD·ABAD*, *4 vertices*, *face derived from source vertex AB*. The six are the **AB, AC, AD, BC, BD and CD** squares.
2. **Choose a square.** Shift-click it on the solid, or shift-click its row in the inspector. With **Residue cells** unchecked only the core shows, so its squares are easy to reach. The left panel then reads *Lift region: 1 face* with a **clear** button, and *connected — closes to 4V · 4E · 1F*.
3. Press the lift button. Before a region was chosen it read **Lift selection → Manuscript**; it now reads **Lift region → Manuscript**. The panel answers, for example: *lifted “face:1gqspju of Ambo Dissection Tetrahedron” → the Manuscript shelf*.
4. Lift the squares **one at a time**. Shift-clicking several faces and lifting them together also works.

## Part 5 · The Manuscript

1. Switch to **Manuscript** at the top. The page has three bands: *dim 1 · loops*, *dim 2 · surfaces*, *dim 3 · manifolds*. Bottom left is **the shelf**, which holds what you lifted under the name of the universe it came from.
2. **Drag** a shelf entry onto the page. The entry now reads *placed*, and the panel on the right shows its card:
   - *this form takes — glue · flip-glue · collapse · cut · fold · identify*: what can be done to it;
   - **the concept layer — carried by the lift**: *4 of 4 corners hold a space*, then one line per corner (*… holds a space of … roles · … words · … tuples*) with **open the drawing**;
   - **the measures**: Euler χ, orientable, H₁, …;
   - **remove** · **set aside**.
3. The square is drawn on the page with its four corners' addresses (for example **ACCD, ACAD, ACBC, ABAC**) and its edges lettered **a, b, c, d**.
4. **The tools** are the bar at the bottom of the page. Each one opens its own panel and says what it needs.
   - **glue**: join a form's edges straight, making a cylinder or a torus.
   - **flip-glue**: join them with a twist, making a Möbius band or a Klein bottle.
   - **collapse**: close the rim to a point, making a sphere.
   - **cut**: cut a form apart.
   - **dualize**: make the form's dual, in which its faces become corners and its corners faces.
   - **sew**: join two rims.
   - **fold**: write the rim's own gluing word yourself.
   - **thicken**: give a form thickness. It takes two forms: the form and a segment.
   - ✎ **identify**: *trace two edge-walks; where they meet, corners become one concept*. Its panel says *tap the corner you start each edge from — the tail lights there; tap a traced edge again to move its tail to the other end*. Which corners become one concept is Arman's decision.
   - **explore inside**: walk inside a 3-manifold you built.
5. **aperture — build a 3-manifold** (bottom right) builds a closed space from a solid form's faces. You pick a face, a second face, and a map between them. Each such pairing is a **door**, and the door first says *carries no concept yet*.
   - ✎ **A door can carry a concept.** Click a role on one side's corner, then one on the other side's. The device answers *taken*, and the role goes through the door, or *not taken*, and says why.
   - **glue** closes the space, and *the S² gate judges* whether it closes properly. That is a judgement of the geometry, never of your concepts.
6. **Walking.** Select what you built and choose **explore inside**.
   - Pick a role at the corner where you enter: *carry from the corner …*.
   - Move it from corner to corner: *carry it along …*.
   - Cross a door by pressing its key.
   - The line reads what happened, with the route, for example *returned to itself by …*, *returned as …*, or *lost at the door …*.

## Saving, and coming back

- **Ambo Universe:** **Export Workspace JSON** writes the universe to a file. **Import Workspace JSON** reads one back.
- **Manuscript:** at the top right the page says *there is work here that is not written down* and *switching modules keeps it · a full reload loses it — save the page… writes it down*. Use **save the page…** and **load the page…**. The shelf's **load universe… (.snapshot.json)** puts a universe on the shelf.

## What the device promises

- It **never names** anything itself. Apart from the seed's letters, which the person's names replace, every Label, role name and word is the person's.
- It **never proposes** a pair or chooses for you.
- It **never grades your concepts**. It prints counts and names, never "valid" and never a tick.
- It **never reads a silence as a fact**. What was not recorded is unknown.

---

## ✎ Every place where Arman's thought goes in

1. A **corner's Label** (Packets tab).
2. **Inside a cast:** the role labels, the words, the quality names and values, and the subject matter (page 3).
3. A **midpoint's Label** (Packets tab, generated midpoints), at both generations.
4. **Pairs at a midpoint:** which role of one side is which role of the other, and which word translates which.
5. **In the Manuscript:** **identify** (which corners become one concept), and a **door's concept** (which role goes through).

At every one of them, Arman gives the thought and you make the device take it.

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

- In a web browser at **`http://localhost:5180`**. This server is yours alone. It runs one version, which the mothership has checked, and it changes only when the mothership announces a new version; work on the engine never reaches it in between. If the page does not answer (after the computer restarts, say), ask Arman to start it.
- **Which version:** the page says it in the left panel, under **Save / Load**: *this page: …*. That is the version your page runs; put it at the top of each report. `http://localhost:5180/__whereami` tells the version the server runs. After a new version arrives, the two differ until your page reloads.
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
| **pair** | your act at a midpoint: this role of A is that role of B, or this word of A is that word of B. A **plain** pair joins them at once, on the whole edge |
| **light** | a face seen from its opposite corner. To pair "in C's light" is to pair *as regards C* |
| **respect** / **triad** | a pairing made in a light ("a is b, as regards c"). A **triad** is three of them made as one act on one face |
| **glued** | two items joined on an edge: paired in every light through it, or paired plainly |
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

   Which role of A is which role of B, and which word translates which, is Arman's decision. The device never offers a pair. These are **plain** pairs: each one joins its two roles at once, on the whole edge.
3b. ✎ **A triad, in a face's light.** On a face you can also pair in a light. Pick one item in each of the face's three concepts, say a fact, an action and a value, and point them as one act. That records three **respects**:
   - this fact is this action, **as regards this value**;
   - this fact is this value, as regards this action;
   - this action is this value, as regards this fact.

   A respect joins nothing by itself, and it binds no other face: the other face through the same edge keeps its own light.
   - **How:** at the midpoint, **open the opposite corner's drawing**. That enters its light, and the head reads, for example, *pointing a triad on the face A·B·C — in C's light*. Opening the other corner's drawing changes the light.
   - **The three picks:** a point in A's column, one in B's, one in the opened drawing, in any order. While the act is open it shows as one line, *a triad in C's light: …*, with *withdraw this attempt*. Once all three are picked the triad is recorded. If one leg is refused, nothing is entered and the refused leg is named.
   - **You need no pairs first.** While you have paired nothing on either of the opposite corner's two edges, the line under its name reads, for example, *its light is open to a triad now; its own reading of A–B needs your pairs on C–A and B–C*. The triad can be pointed at once. Only the corner's own reading of the edge waits for those pairs.
   - **Word triads** work the same way. Opening the corner's drawing also adds a third row of words above the drawing, *C's words*, next to A's and B's. The words come in the order the cast gives them, and none is lit, sorted or paired for you. A word in each of the three rows, picked in any order, is one act. While it is open it shows as *a word triad in C's light: …*, with *withdraw this attempt*.
   - **Which three items are the same, and in which light, is Arman's decision.**
4. **What the midpoint tells you:**
   - its own space so far. Before your first pair it reads, for example, *A and B together, as two — … roles · … words, 2 of them the views of the opposite corners, C's and D's — no tuple on them yet · … tuples · … marks*; after it, the same count heads the midpoint's own column. Each opposite corner (at AB, C and D, each named by its label) adds one word of its own, its view of your pairing, whether or not it holds a concept yet. A view is read in that corner's block and drawn nowhere, and once your pairs on that corner's two edges meet at one of its roles, it has tuples too (*— 1 tuple on them*). A light in which you have pointed a role triad adds one more word, that light's own, with a tuple for each different pair of A's and B's items those triads name; it is not one of the views;
   - the words translated so far, for example *no word translated yet — each word still its own side's, alike spellings included*;
   - **below the drawing**, every pair you gave, listed whole: role pairs with *· yours · withdraw* (once a light has spoken on that edge, *· yours, plain · withdraw*), and the word pairs;
   - **the glue:** two items are joined on an edge only when you have paired them in **every** light through that edge (both faces), or paired them plainly. The pairs line says so, for example *F7 ≡ Φ1 · glued — you gave it in C's light and in D's*. Until both faces have spoken it says *only C's light has spoken on A–B; nothing glues here by respects until D's does*. A pair that would join one item twice is *left out*, and a pair that would break a pair one generation down is *held back*; each says why. Where the two faces' lights differ on this edge, it says so once, as a fact;
   - **your respects,** in each opposite corner's block, first, as what you said. For example *you said: F7 is Φ1, as regards r3 — honored*, or *— broken at C–B: there you paired r6 with Φ5*, or *— not yet: nothing paired on A–C*. These are readings: nothing asks you to re-pair. A triad's one control is *withdraw this triad*.
   - under the midpoint's own column, what **each opposite corner** makes of your pairing, for example *C's view of your pairing on A–B* with *agrees on …*, *would pair … otherwise*, *would join what you have not paired: …*. These are readings, never buttons.
5. **A face reads** once all three of its edges hold pairs. For the face **A·B·C**, walked in its own direction (A → B → C → A), each role is *returned to itself*, *returned elsewhere*, or *did not return*. At each corner the reading also says *the face's core at A, derived: N of its M roles*: how many of that corner's roles come back at all after the walk, to themselves or elsewhere. *Derived* means the device computed it; nobody gave it. Until then the midpoint says what the face still needs, for example *no reading yet — it needs a record on each of its three edges*.
6. **When an opposite corner's view is silent,** it says why: *C says nothing about A–B — you have paired nothing on A–C yet*, or, when both of its edges hold pairs that do not chain through any of its roles, *— your pairings on A–C and C–B do not meet*.
7. ✎ **The midpoint's name.** Each midpoint has a packet of its own, like a corner, with a **Label**. The Packets tab counts them (*unresolved generated midpoint packets*) and steps through them with **Previous unresolved**, **Next unresolved** and **Save and next unresolved**.

## Part 3 · The second dissection (generation 2)

1. Open the **Workspace** tab and click the **octahedron** card, marked **core** and **g1**. The left panel says *Ready to dissect selected octahedron core.* Press **Apply Ambo Dissection**.
2. The octahedron is cut into a **cuboctahedron** (the new core, g2) and six **square pyramids**. New midpoints appear between the first ones: **ABAC, ABAD, …**
3. **The born room.** Open a new midpoint, such as **ABAC**, from the Packets tab. It reads *ABAC · the midpoint between AC and AB* and shows two kinds of thing:
   - what the solid has already made one, for example *… stand on both sides as one — composed, not yours (their points hollow)*;
   - what is left for the person, for example *the born room: 10 roles of AC and 9 of AB together, as two · no pair of yours yet*. Once you pair here, those pairs read *yours, born here*.

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
- **Export after every step that matters.** A reload loses what is not saved. The mothership announces each new version before it arrives: export first (the page may reload by itself when the version arrives), and once it has arrived, reload the page yourself and import your file. The saved file brings your work back, word pairs included.
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
4b. **Triads, in a face's light:** which item of each of the face's three concepts are the same, as regards the third.
5. **In the Manuscript:** **identify** (which corners become one concept), and a **door's concept** (which role goes through).

At every one of them, Arman gives the thought and you make the device take it.

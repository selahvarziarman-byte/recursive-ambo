# 3 · How the device takes a concept: the cast

Your first job, for each of Arman's four seeds, is to make a **cast**: the file the device takes a concept from. This page is only about the **device part**: the file, what the device does with each part of it, and what it answers when you load it. **What goes into a cast (which roles, which relations, what anything is called) is Arman's thought.** Where the file needs something only he can give, ask him. Never fill it in yourself.

Every answer quoted below in *italics* is the device's own wording.

---

## The file

A cast is one JSON file. The button that loads it says **load cast… (.cast.json)**. Three lists are required: `roles`, `signature`, `relations`. If the file is not JSON, or one of the three lists is missing, the device answers:

> *this file is not a cast*

The smallest cast is pure structure: three points and one kind of relation. The bare letters show the shape only. A real cast carries Arman's words (see **Roles** and **Optional parts** below).

```json
{
  "roles": ["x", "y", "z"],
  "signature": [
    { "type": "r", "arity": 2 }
  ],
  "relations": [
    { "type": "r", "terms": ["x", "y"], "polarity": "holds" },
    { "type": "r", "terms": ["y", "z"], "polarity": "holds" }
  ]
}
```

Loaded, it answers: *taken — 3 roles · 1 relation-type · 2 relations · read as directed*.

---

## Roles: the points of the concept

Each role is one of the distinct ways the concept shows up. A role is written either as a bare string (`"x"`, which is its id) or as an object:

- **`id`** (required): the device's handle for the role. It must be unique in the file. A role object without an id is not taken (*role 0: has no id — not taken*), and the rest of the cast still is.
- **`label`** (optional): the role's **name**, as text. The screen shows the label wherever the role appears and falls back to the id when there is none. **The label is Arman's word.** A role he has not named has no label. Never write a placeholder, because the device would read it as the name.
- **`types`** (optional): qualities of the role, written as `{ "quality name": "value" }`.
  - The value must be text. A value that is not text (a number, for example) is dropped, and nothing says so.
  - One quality is predefined for every cast: **`member_status`**, with three values:
    - `has`: the role has members.
    - `unrecorded`: members exist, none on record.
    - `none-by-nature`: it has none.
  - The device compares `member_status` between two casts by itself. Every other quality is foreign to another cast until it is translated at a midpoint.
  - Writing `UNKNOWN`, or leaving a quality out, means **unknown**, never a value.
  - On the card, a quality counts as a word of its own, and each role that has it counts as one relation. One quality on one role, plus one declared word with two relations, reads *2 relation-types · 3 relations*.
- Anything else you put on a role (a gloss, a source, a note) is carried with that role and never read.

## The signature: the words

The signature lists the **words**: the kinds of relation the concept uses. The app also calls them *relation-types*.

- **`type`**: the word itself.
- **`arity`**: how many roles it relates. It is a whole number, 1 or more.

## Relations: what holds

- **`type`**: a word from the signature.
- **`terms`**: role ids, **in order**. `r(x, y)` is not `r(y, x)`.
- **`polarity`**: `holds` or `does-not-hold`. Anything else is not taken: *relation 2: polarity "maybe" is neither holds nor does-not-hold — not taken*.
- **A relation you do not list is unrecorded: unknown, never false.** If Arman says a relation does **not** hold, write it with `does-not-hold`. If he says nothing about it, write nothing.
- The card reads the order of the terms. It says *read as symmetric* when every relation of two or more terms is also listed in every other order, and *read as directed* otherwise. When there is no relation of two or more terms, it says neither.

## Optional parts

- **`subject_matter`** (or `subject`): one line saying what the concept is about, in Arman's words. The card shows it.
- **`axioms`**: sentences, as strings or as `{ "sentence": "…" }`. They are carried and never evaluated. The card adds, for example, *2 axioms carried, never evaluated*.
- **Everything the device does not use** is carried with the cast as its warrant, and the card adds *warrant carried, never read*. That covers extra fields on signature entries and relations (a meaning, properties, a reason), extra fields at the top of the file, and any item the device could not take.

---

## What the device answers

**Taken.** For example: *taken — 3 roles · 1 relation-type · 2 relations · read as directed*. The device never grades a cast: no tick, no "valid", no green.

**Refused.** There are only two ways:
1. *this file is not a cast*: the file is not JSON, or one of the three lists is missing.
2. *not taken — the record states two things about …*: the file contradicts itself. The refusal names every place where it does:
   - the same relation listed both ways: *r(x, y) is listed both holds and does-not-hold*
   - one role id declared twice, with different content: *role id "x" is declared twice*
   - one word declared with two arities: *type "r" is declared with arity 2 and arity 3*
   - one name used both as a word and as a quality on the roles: *"r" is declared in the signature and on the roles*

   Mend the file and load it again.

**Taken, with marks.** The device takes the cast and says what it could not use. It never refuses for these:
- a relation naming a role that is not in `roles`: *relation 0: "w" is not among your roles*
- a relation whose word is not in the signature: *relation 0: type "s" is not in your signature*
- the wrong number of terms: *1 tuple with the wrong arity*
- an item that is not well-formed (no id, no type, no terms, an unknown polarity) is left out, and the card lists it: *1 item not taken: relation 2*

An identical line written twice is read once, with no mark. A cast with an empty `roles` list reads *a cast of nothing — no roles*.

---

## Where the names go

- **The corner's own name is not in the cast.** It is the **Label** in the corner's card, in the Packets tab: Arman's name for the concept that corner holds. Loading a cast never fills it.
- **Inside the cast, Arman's words go into:** the role labels, the words of the signature, the quality names and their values, and the subject matter.
- **Yours are the ids**, which are handles the device needs and he does not, and the shape of the file.
- **An unnamed thing stays unnamed.** Never invent a label, a word or a relation on his behalf.

## How the words are used later

When two corners meet at a midpoint, **words never match by spelling.** Every word of one cast is foreign to the other until the person translates it by hand. The midpoint says so itself: *no word translated — every word foreign to the other side, alike spellings included*. `member_status` is the one exception, because it is shared by definition.

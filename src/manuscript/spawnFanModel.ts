// spawnFanModel — B-124: THE FAN AT REST (F.1–F.5, the designer's ruling).
//
// THE DEFECT THIS FILE REMOVES: `chrome.spawnOffset` was consumed at the
// view's birth sites as `home: [target.home[0] + spawnOffset, target.home[1],
// 0]` — a CONSTANT, so every child of a parent was ASSIGNED THE SAME SLOT.
// "Six children at one home do not look like six illegible things. THEY LOOK
// LIKE ONE THING" — and exhaustion is *all its children are on the page*, so
// a spent parent was indistinguishable from a parent with five left: the page
// stated a FALSE COUNT. Her law: place from the POPULATION, never from a
// constant.
//
//   F.1 — slots fan rightward from the parent at DISTINCT ANGLES, so N
//         children at rest are N distinguishable edges — no gesture required.
//   F.2 — the placement is COMPUTED from the parent's existing children: the
//         producer reads the homes this parent's children hold NOW and takes
//         the first FREE slot of a deterministic ladder (a child he dragged
//         away frees its slot for a later birth; nothing else changes).
//   F.3 — D.3 HOLDS: this is an INITIAL LAY, computed once at a birth, for
//         the NEWBORN alone. The producer reads existing homes and returns
//         one new home; it never moves what stands. The page places; he
//         rearranges; the page never takes it back.
//   F.4 — ONE PRODUCER: every birth site calls `spawnHomeForBirth`; the
//         geometry exists in this file and nowhere else.
//
// THE GEOMETRY (craft, plated for the designer — B-124 §2.1: choose one,
// drive it, give her a plate): a hand-of-cards ARC opening rightward. Slot 0
// is the old constant's own slot (parent + radius on x), so a single child
// lands exactly where it always did. Ring 1 sits at the `spawnOffset` radius
// with FAN.stepDeg between slots inside ±FAN.arcHalfDeg; a full ring doubles
// out to the next (radius·ring) at step/ring — the CHORD between adjacent
// slots (≈ radius·step in radians) is preserved, so crowding never grows
// with distance — with the ladder offset half a step so no outer slot is
// collinear with an inner one (a collinear slot would lay its edge exactly
// over a shorter edge and hide it). Distinct angles hold through ring 5
// (61 slots); a page past that is not a fan anyway.

export type PageHome = readonly [number, number, number];

export const FAN = {
  stepDeg: 35, // ring-1 angular step — chord 2·r·sin(17.5°) ≈ 3.6 world at r=6
  arcHalfDeg: 70, // the fan opens rightward within ±arcHalf (past ~90° a child no longer reads as begotten out of the parent)
  clearance: 1.8, // a slot with a child nearer than this is OCCUPIED (half the ring-1 chord)
} as const;

// The deterministic slot ladder: ring 1 nearest first (0, +s, −s, +2s, −2s …),
// each further ring offset by half its own step. Pure sequence — no occupancy.
export function spawnFanSlots(parentHome: PageHome, radius: number, ring: number): Array<[number, number, number]> {
  const step = FAN.stepDeg / ring;
  const angles: number[] = [];
  if (ring === 1) {
    angles.push(0);
    for (let k = 1; k * step <= FAN.arcHalfDeg; k += 1) angles.push(k * step, -k * step);
  } else {
    for (let a = step / 2; a <= FAN.arcHalfDeg; a += step) angles.push(a, -a);
  }
  const r = radius * ring;
  return angles.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [parentHome[0] + r * Math.cos(rad), parentHome[1] + r * Math.sin(rad), 0];
  });
}

// F.1 + F.2 — the first slot of the ladder that no existing child occupies.
// Occupancy is a DISTANCE read of the children's CURRENT homes (never their
// birth slots), so his arrangement is respected: a dragged child stops
// holding the slot it left. Termination: one child can occupy at most two
// slots of one ring (adjacent slots sit a full chord apart) and none of any
// other ring (rings are `radius` apart ≫ clearance), so by ring
// (children+2) a free slot provably exists; the unconditional return is the
// unreachable backstop, never a second mechanism.
export function spawnFanHome(parentHome: PageHome, childHomes: ReadonlyArray<PageHome>, radius: number): [number, number, number] {
  const maxRing = childHomes.length + 2;
  let last: [number, number, number] = [parentHome[0] + radius, parentHome[1], 0];
  for (let ring = 1; ring <= maxRing; ring += 1) {
    for (const slot of spawnFanSlots(parentHome, radius, ring)) {
      last = slot;
      const occupied = childHomes.some((h) => Math.hypot(h[0] - slot[0], h[1] - slot[1]) < FAN.clearance);
      if (!occupied) return slot;
    }
  }
  return last;
}

// The minimal shape of a written entry this producer reads — structural, so
// a witness imports the real function without mounting the view.
export interface SpawnSiblingEntry {
  form: {
    parentShape: { id: string } | null;
    parentShapes?: ReadonlyArray<{ id: string }>;
  };
  home: PageHome;
}

// F.4 — THE one producer the birth sites call. "The parent's existing
// children" is every written entry that names the target among its parents —
// the same parenthood the genealogy edges draw from (`parentShape`, plus the
// connected-sum's `parentShapes`), so the fan fans exactly the things that
// have edges.
export function spawnHomeForBirth(
  target: { shape: { id: string }; home: PageHome },
  written: ReadonlyArray<SpawnSiblingEntry>,
  radius: number,
): [number, number, number] {
  const childHomes = written
    .filter(
      (w) =>
        w.form.parentShape?.id === target.shape.id ||
        (w.form.parentShapes?.some((p) => p.id === target.shape.id) ?? false),
    )
    .map((w) => w.home);
  return spawnFanHome(target.home, childHomes, radius);
}

"""THE MEET-CORE's 4,000 RANDOM TETRAHEDRA — the researcher's own draws (meet_core_P6.py, seed 391), dumped once so the
app's meet can be run over the very configurations that sealed `47 conflicts · 958 core moves in 4,000` (ADR 0031 §3.11).
The RNG is replayed exactly: the instrument draws its 42 independent face-sections FIRST (they depend on the fixtures'
role lists and the hand triples), then the 4,000 (t1, t2) pairs; both phases are copied here verbatim so the sequence
is the instrument's. Run from the repo root: python scripts/fixtures/gen_meet_core_P6_configs.py
Writes scripts/fixtures/meet_core_P6_configs.json — [{"t1": [[a, c, b], …], "t2": [[a, d, b], …]}, …]."""
import json
import os
import random
import sys
import itertools

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
INSTR = os.path.join(ROOT, '.handoff', 'instruments', 'connection_layer_reference')
sys.path.insert(0, INSTR)
os.chdir(INSTR)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv  # noqa: E402
from inside_midpoint_trace import load  # noqa: E402

rng = random.Random(391)
flow, tcell, phi = load("flow")["roles"], load("t-cell")["roles"], load("phi")["roles"]
# phase 1 — the instrument's independent sections on the 42 triples (draws consumed, values discarded)
for tf, tp, fp in itertools.product(HAND_TF, HAND_TP, J_FP):
    J_AC, J_CB = J_FP[fp], inv(HAND_TP[tp])
    sec = [(a, J_AC[a], J_CB[J_AC[a]]) for a in flow if a in J_AC and J_AC[a] in J_CB]
    _rsec = [(rng.choice(flow), rng.choice(phi), rng.choice(tcell)) for _ in range(len(sec) or 3)]
# phase 2 — the 4,000 random tetrahedra: respects from triads on ABC (a, c, b) and ABD (a, d, b)
R = list(range(5))
configs = []
for _ in range(4000):
    t1 = [(rng.choice(R), rng.choice(R), rng.choice(R)) for _ in range(rng.randint(1, 5))]
    t2 = [(rng.choice(R), rng.choice(R), rng.choice(R)) for _ in range(rng.randint(0, 5))]
    configs.append({"t1": t1, "t2": t2})
out = os.path.join(ROOT, 'scripts', 'fixtures', 'meet_core_P6_configs.json')
with open(out, 'w', encoding='utf-8', newline='\n') as f:
    json.dump(configs, f, separators=(',', ':'))
# the instrument's own M1/M3 over the same draws, printed as the generator's self-check
import collections
def injective(pairs):
    a = collections.Counter(x for x, _ in pairs); b = collections.Counter(y for _, y in pairs)
    return all(v == 1 for v in a.values()) and all(v == 1 for v in b.values())
m1 = m3 = 0
for c in configs:
    p1 = {(a, b) for a, _, b in c["t1"]}; p2 = {(a, b) for a, _, b in c["t2"]}
    meet = p1 & p2
    m1 += not injective(meet); m3 += bool(meet)
print(f"wrote {out} · {len(configs)} configurations · M1 (meet not one-to-one) {m1} · M3 (meet non-empty) {m3}   (the instrument: 47 · 958)")

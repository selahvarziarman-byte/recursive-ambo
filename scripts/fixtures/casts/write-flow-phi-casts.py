"""Flow and Φ as fixtures FROM THE RECORD — C-6c (vii), corrected by C-6d (γ) §1.3 (the canonical key is
`member_status`, the MOLD v4 §5 template's; `member-status` was a transcription slip of (vii)).

Input: hinge_data.py (F · FR · PHI · PR) in .handoff/instruments/connection_layer_reference — the researcher's
record, GITIGNORED with the rest of .handoff; this generator is tracked so the transcription is reproducible, its
input is not. member_status per role as first_face_and_tower.py declares it (Flow all `has`; Φ1–Φ8 `has`, Φ9
`none-by-nature`); the roles' ids as the instrument names them; everything the type lacks carried unread on the
warrant. hinge_data.py has NO docstring, so NO subject is written (the instrument's own words or none — never mine).

    python scripts/fixtures/casts/write-flow-phi-casts.py
"""
import io
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = HERE
REF = os.path.join(REPO, '.handoff', 'instruments', 'connection_layer_reference')

g = {}
exec(open(os.path.join(REF, 'hinge_data.py'), encoding='utf-8').read(), g)
F, FR, PHI, PR = g['F'], g['FR'], g['PHI'], g['PR']
assert g.get('__doc__') is None, 'hinge_data.py grew a docstring — carry its words as the subject'


def cast(roles, tuples, member_status, source_note):
    tuples = sorted(tuples, key=lambda x: (x[0], x[1], x[2]))
    types = sorted({t for t, _, _ in tuples})
    return {
        "source": source_note,
        "roles": [{"id": r, "types": {"member_status": member_status[r]}} for r in roles],
        "signature": [{"type": t, "arity": 2} for t in types],
        "relations": [{"type": t, "terms": [a, b], "polarity": "holds"} for t, a, b in tuples],
    }


def write(name, obj):
    p = os.path.join(OUT, name)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(obj, indent=2, ensure_ascii=False) + '\n')
    print('wrote', name, len(obj['roles']), 'roles', len(obj['signature']), 'types', len(obj['relations']), 'tuples')


write('flow.cast.json', cast(F, FR, {r: "has" for r in F},
      "hinge_data.py — Flow, in-universe as cast; the two structurally inconsistent self-loops removed (dup / irreflexive-violating); member_status per role as first_face_and_tower.py declares it"))
write('phi.cast.json', cast(PHI, PR, {**{f"Φ{i}": "has" for i in range(1, 9)}, "Φ9": "none-by-nature"},
      "hinge_data.py — Φ, exactly as cast (role grain; duplicate role-level edges collapse); member_status per role as first_face_and_tower.py declares it"))

import itertools, collections, sys
# ---------- Φ, exactly as cast (role grain; duplicate role-level edges collapse) ----------
PHI=[f"Φ{i}" for i in range(1,10)]
PR=set([("descends-from","Φ1","Φ1"),("descends-from","Φ1","Φ8"),("descends-from","Φ6","Φ1"),("descends-from","Φ7","Φ7"),
 ("disjoins","Φ8","Φ1"),("disjoins","Φ1","Φ1"),("specifies","Φ2","Φ1"),("transmits","Φ3","Φ2"),("re-creates","Φ3","Φ1"),
 ("converges-on","Φ1","Φ5"),("converges-on","Φ6","Φ5"),("displaces","Φ5","Φ1"),("displaces","Φ1","Φ1"),
 ("presupposes","Φ1","Φ1"),("presupposes","Φ1","Φ7"),("component-of","Φ7","Φ1"),("component-of","Φ4","Φ1"),
 ("lodges-in","Φ2","Φ1"),("decays","Φ2","Φ9"),("fills","Φ6","Φ9"),("inverts","Φ1","Φ1"),("exceeds-in-power","Φ1","Φ1")])
# ---------- Flow, in-universe as cast; the two structurally inconsistent self-loops removed (dup / irreflexive-violating) ----------
F=[f"F{i}" for i in range(1,15)]
FR=set([("presupposes","F8","F7"),("presupposes","F7","F1"),("presupposes","F11","F3"),("presupposes","F9","F13"),
 ("presupposes","F5","F2"),("presupposes","F4","F2"),("presupposes","F6","F2"),("presupposes","F10","F3"),("presupposes","F13","F12"),
 ("generates","F7","F8"),("generates","F1","F7"),("generates","F2","F4"),("generates","F2","F5"),("generates","F3","F9"),
 ("generates","F13","F9"),("generates","F9","F5"),("generates","F12","F13"),
 ("opposes","F4","F6"),("opposes","F6","F4"),
 ("precedes","F13","F9"),("precedes","F7","F8"),("precedes","F3","F5"),
 ("exceeds-in-speed","F1","F2"),("exceeds-in-speed","F7","F8"),("exceeds-in-size","F8","F7"),("exceeds-in-capacity","F7","F1"),
 ("exceeds-in-speed","F12","F1"),("exceeds-in-speed","F1","F13"),
 ("sustains","F7","F7"),("sustains","F5","F5"),("releases","F13","F9"),("releases","F3","F9"),("disjoins","F4","F4"),("regulates","F7","F1")])

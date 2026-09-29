// the person's record, as filed in the construction (generation 1 and 2), keyed for the device: role ids, modes, directions
const ROLE = { Unity: 'Q1', Plurality: 'Q2', Totality: 'Q3', Reality: 'L1', Negation: 'L2', Limitation: 'L3', Inherence: 'R1', Causality: 'R2', Community: 'R3', Possibility: 'M1', Existence: 'M2', Necessity: 'M3' };
const CORNER = { Q: 'Quantity', L: 'Quality', R: 'Relation', M: 'Modality' };
const cornerOf = (roleId) => CORNER[roleId[0]];
// the seed edges in the device's orientation (first corner, second corner) and their midpoint's composed label
const G1_MEDIA = [
  ['Quantity', 'Quality'], ['Quantity', 'Relation'], ['Quantity', 'Modality'], ['Quality', 'Relation'], ['Quality', 'Modality'], ['Relation', 'Modality'],
];
// τ at generation 1: synthesis and correlate at every medium; all ↔ all-times at Quantity–Modality
const G1_TAU = (a, b) => [['synthesis', 'synthesis'], ['correlate', 'correlate'], ...(a === 'Quantity' && b === 'Modality' ? [['all', 'all-times']] : [])];
// (id, mode, from, to, sign) — direction as Kant's sentence; the device will orient x to the first corner
const G1_RELATINGS = [
  ['d1', 'apprehended-as', 'Reality', 'Unity', '+'], ['d2', 'approaches', 'Plurality', 'Negation', '+'], ['d3', 'limits', 'Limitation', 'Totality', '+'],
  ['m1', 'conserved-as', 'Inherence', 'Totality', '+'], ['m2', 'orders', 'Causality', 'Plurality', '+'], ['m3', 'coordinates', 'Community', 'Totality', '+'],
  ['v1', 'holds-at', 'Existence', 'Unity', '+'], ['v2', 'holds-at', 'Possibility', 'Plurality', '+'], ['v3', 'holds-at', 'Necessity', 'Totality', '+'],
  ['a1', 'persists-as', 'Reality', 'Inherence', '+'], ['a2', 'grounds', 'Reality', 'Causality', '+'], ['a3', 'happens-under', 'Negation', 'Causality', '+'],
  ['a4', 'passes-under', 'Limitation', 'Causality', '+'], ['a5', 'reciprocal-in', 'Limitation', 'Community', '+'], [null, 'perishes-into', 'Inherence', 'Negation', '-'],
  ['t1', 'connected-with', 'Existence', 'Reality', '+'], ['t2', 'material-of', 'Reality', 'Possibility', '+'], ['t3', 'determines', 'Limitation', 'Possibility', '+'], [null, 'IS', 'Negation', 'Possibility', '-'],
  ['n1', 'connected-by', 'Existence', 'Causality', '+'], ['n2', 'concerns', 'Necessity', 'Causality', '+'], ['n3', 'divides', 'Community', 'Possibility', '+'], [null, 'concerns', 'Necessity', 'Inherence', '-'],
];
// the person's names at generation 1, by medium
// named from the DEVICE's own parts after its sorting (2026-09-28): two names moved from the construction (Degree -> Limit; Modi of time -> Quantum of substance)
const G1_NAMES = { 'Quantity|Quality': 'Limit', 'Quantity|Relation': 'Quantum of substance', 'Quantity|Modality': 'Validity', 'Quality|Relation': 'Alteration', 'Quality|Modality': 'Matter', 'Relation|Modality': 'Material necessity' };
// the person's verdicts at generation 1 (view, path as the device orients it will be matched by role ids and modes, any order)
const G1_VERDICTS = [
  { medium: 'Quantity|Modality', view: 'Quality', legs: [['connected-with', 'M2', 'L1'], ['apprehended-as', 'L1', 'Q1']], direct: ['holds-at', 'M2', 'Q1'], verdict: 'composed' },
  { medium: 'Relation|Modality', view: 'Quality', legs: [['connected-with', 'M2', 'L1'], ['grounds', 'L1', 'R2']], direct: ['connected-by', 'M2', 'R2'], verdict: 'composed' },
  { medium: 'Quantity|Quality', view: 'Relation', legs: [['reciprocal-in', 'L3', 'R3'], ['coordinates', 'R3', 'Q3']], direct: ['limits', 'L3', 'Q3'], verdict: 'not' },
  { medium: 'Quality|Modality', view: 'Relation', legs: [['reciprocal-in', 'L3', 'R3'], ['divides', 'R3', 'M1']], direct: ['determines', 'L3', 'M1'], verdict: 'composed' },
];
module.exports = { ROLE, CORNER, cornerOf, G1_MEDIA, G1_TAU, G1_RELATINGS, G1_NAMES, G1_VERDICTS };

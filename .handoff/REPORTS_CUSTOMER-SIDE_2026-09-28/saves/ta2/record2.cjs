// RUN 2 · the person's record: Fact / Value / Meaning / Action — roles, the modes with their converses (R-D3 by hand), the
// generation-1 relatings as named theses with their force (hypothesis +, refutation −), τ, and (later) the names.
const ROLE = {
  'State of affairs': 'F1', 'Truth-maker': 'F2', 'Social fact': 'F3', 'Facticity': 'F4', 'Constituted fact': 'F5',
  'Good in itself': 'V1', 'Instrumental value': 'V2', 'Value-positing': 'V3', 'Fittingness': 'V4', 'Validity claim': 'V5',
  'Sense': 'M1', 'Reference': 'M2', 'Use': 'M3', 'Différance': 'M4', 'Significance': 'M5',
  'Intention under a description': 'A1', 'Reason as cause': 'A2', 'Deed as beginning': 'A3', 'Communicative act': 'A4', 'Imputation': 'A5',
};
const CORNER = { F: 'Fact', V: 'Value', M: 'Meaning', A: 'Action' };
const cornerOf = (roleId) => CORNER[roleId[0]];
const CASTS = { A: ['Fact', 'fact.cast.json'], B: ['Value', 'value.cast.json'], C: ['Meaning', 'meaning.cast.json'], D: ['Action', 'action.cast.json'] };
// the six media by corner names (the device's own orientation is read after the dissection and stored in g1_orientation.json)
const G1_MEDIA = [['Fact', 'Value'], ['Fact', 'Meaning'], ['Fact', 'Action'], ['Value', 'Meaning'], ['Value', 'Action'], ['Meaning', 'Action']];
// τ: the two words every cast shares, and the special pair a medium's discourse supports (cast word of the first ≡ cast word of the second)
const G1_TAU = (a, b) => {
  const pairs = [['grounds', 'grounds'], ['independent-of', 'independent-of']];
  const k = `${a}|${b}`;
  const special = { 'Fact|Action': ['counts-as', 'under-description'], 'Fact|Meaning': ['constituted-by', 'constituted-by'], 'Value|Meaning': ['posits', 'projects'], 'Value|Action': ['binds', 'answers-for'] }[k];
  return special ? [...pairs, special] : pairs;
};
// every directed mode with its converse; a symmetric word names itself
const CONVERSE = {
  'entangled-with': 'entangled-with', sets: 'set-by', selects: 'selected-by', surpasses: 'surpassed-by', entails: 'entailed-by', defines: 'defined-by', redeems: 'redeemed-by',
  pictures: 'pictured-by', 'stated-by': 'states', 'conditioned-by': 'conditions', 'corresponds-to': 'corresponded-by', constitutes: 'constituted-in', discloses: 'disclosed-in', withholds: 'withheld-by', fixes: 'fixed-by',
  knows: 'known-by', creates: 'created-by', 'passes-into': 'receives', situates: 'situated-in', presupposes: 'presupposed-by', explains: 'explained-by', compels: 'compelled-by',
  interprets: 'interpreted-by', 'raised-in': 'raises', expresses: 'expressed-in', 'refers-to': 'referent-of',
  warrants: 'warranted-by', requires: 'required-by', 'aims-at': 'aimed-at-by', orients: 'oriented-by', 'judged-by': 'judges', 'enacted-in': 'enacts',
  'performed-in': 'performs', describes: 'described-by', 'instituted-in': 'institutes', configures: 'configured-by', moves: 'moved-by', baptizes: 'baptized-in',
};
for (const [w, c] of Object.entries({ ...CONVERSE })) if (!(c in CONVERSE)) CONVERSE[c] = w;
// (id, mode, from-role label, to-role label, sign, source) — direction as the thesis says it; the device orients x to the edge's first corner
const G1_RELATINGS = [
  // Fact – Value
  ['fv1', 'entangled-with', 'Social fact', 'Fittingness', '+', 'Putnam, The Collapse of the Fact/Value Dichotomy (2002): thick ethical concepts; Murdoch'],
  ['fv2', 'sets', 'Value-positing', 'Constituted fact', '+', 'Nietzsche, Nachlass 7[60]: no facts, only interpretations; perspectivism'],
  ['fv3', 'selects', 'Fittingness', 'Constituted fact', '+', 'Rickert (1902), Weber (1904): Wertbeziehung — value-relevance selects what becomes a fact of inquiry'],
  ['fv4', 'surpasses', 'Value-positing', 'Facticity', '+', 'Sartre, Being and Nothingness: value arises as freedom surpasses its facticity'],
  ['fv5', 'entails', 'State of affairs', 'Validity claim', '-', 'Hume, Treatise 3.1.1: no ought from is'],
  ['fv6', 'defines', 'State of affairs', 'Good in itself', '-', 'Moore, Principia Ethica §13: the open question; the naturalistic fallacy'],
  ['fv7', 'redeems', 'Truth-maker', 'Validity claim', '-', 'Habermas, TCA I: rightness claims are redeemed discursively, not by truth-makers'],
  // Fact – Meaning
  ['fm1', 'pictures', 'Sense', 'State of affairs', '+', 'Wittgenstein, Tractatus 2.1–2.221: the picture presents a state of affairs; its sense is what it presents'],
  ['fm2', 'stated-by', 'State of affairs', 'Sense', '+', 'Strawson, "Truth" (1950): facts are what statements state; Frege, "The Thought" (1918): a fact is a true thought'],
  ['fm3', 'conditioned-by', 'Sense', 'Truth-maker', '+', 'Davidson, "Truth and Meaning" (1967): sense given by truth conditions'],
  ['fm4', 'corresponds-to', 'Reference', 'State of affairs', '+', 'Russell, Problems of Philosophy ch. 12: correspondence'],
  ['fm5', 'constitutes', 'Use', 'Social fact', '+', 'Searle 1995: status functions collectively accepted in use; Wittgenstein: forms of life'],
  ['fm6', 'discloses', 'Significance', 'Facticity', '+', 'Heidegger, SZ §§29–32: attunement and understanding disclose thrownness'],
  ['fm7', 'withholds', 'Différance', 'State of affairs', '+', 'Derrida, Of Grammatology: no outside-text; presence deferred'],
  ['fm8', 'fixes', 'State of affairs', 'Sense', '-', 'Quine, Word and Object ch. 2: indeterminacy of translation — the facts do not fix the meaning'],
  // Fact – Action
  ['fa1', 'knows', 'Intention under a description', 'State of affairs', '+', 'Anscombe, Intention §§28–32: practical knowledge, without observation'],
  ['fa2', 'creates', 'Communicative act', 'Social fact', '+', 'Searle 1995 / Speech Acts: declarations create institutional facts'],
  ['fa3', 'passes-into', 'Deed as beginning', 'Social fact', '+', 'Arendt, The Human Condition §25: the deed falls into the web of relationships and becomes a story'],
  ['fa4', 'situates', 'Facticity', 'Deed as beginning', '+', 'Heidegger SZ §29; Sartre BN part IV: facticity as the situation of action'],
  ['fa5', 'presupposes', 'Imputation', 'State of affairs', '+', 'Ricoeur, Oneself as Another, fourth study: ascription presupposes the deed as event'],
  ['fa6', 'explains', 'Reason as cause', 'State of affairs', '+', 'Davidson 1963: rationalization is a species of causal explanation of what was done'],
  ['fa7', 'compels', 'State of affairs', 'Deed as beginning', '-', 'Hume, Treatise 2.3.3: reason alone cannot motivate; Sartre: no fact compels'],
  // Value – Meaning
  ['vm1', 'defines', 'Sense', 'Good in itself', '-', 'Moore, Principia Ethica §§6–13: good is indefinable'],
  ['vm2', 'interprets', 'Value-positing', 'Significance', '+', 'Nietzsche, GM; Twilight, "Improvers" 1: there are no moral facts, only interpretations'],
  ['vm3', 'raised-in', 'Validity claim', 'Use', '+', 'Habermas, TCA I: validity claims are raised in speech acts'],
  ['vm4', 'discloses', 'Significance', 'Fittingness', '+', 'Scheler, Formalism II: values given in feeling; Heidegger SZ §18: significance'],
  ['vm5', 'withholds', 'Différance', 'Good in itself', '+', 'Derrida, "Différance": the good as presence deferred'],
  ['vm6', 'expresses', 'Use', 'Fittingness', '+', 'Ayer, Language, Truth and Logic ch. 6; Gibbard 1990: evaluative use expresses attitude'],
  ['vm7', 'refers-to', 'Reference', 'Good in itself', '-', 'Mackie, Ethics (1977) ch. 1: no objective values to refer to (error theory)'],
  // Value – Action
  ['va1', 'warrants', 'Fittingness', 'Reason as cause', '+', 'Scanlon 1998 ch. 2: to be valuable is to have properties that provide reasons'],
  ['va2', 'requires', 'Validity claim', 'Deed as beginning', '+', 'Kant, KrV A548/B576, Religion 6:50: ought implies can'],
  ['va3', 'aims-at', 'Deed as beginning', 'Good in itself', '+', 'Aristotle, NE I.1, VI.5: praxis is for the sake of the good; its end is in itself'],
  ['va4', 'orients', 'Instrumental value', 'Deed as beginning', '+', 'Weber, Economy and Society I §2: zweckrational action'],
  ['va5', 'raises', 'Communicative act', 'Validity claim', '+', 'Habermas, TCA I: every speech act raises validity claims'],
  ['va6', 'judged-by', 'Imputation', 'Validity claim', '+', 'Kant, MM 6:227: imputation is a judgment under a law; Ricoeur'],
  ['va7', 'enacted-in', 'Value-positing', 'Deed as beginning', '+', 'Nietzsche, GM I §13: the deed is everything; the positing is in the doing'],
  ['va8', 'creates', 'Deed as beginning', 'Validity claim', '-', 'Habermas: validity transcends the act that raises it; the deed does not create it'],
  // Meaning – Action
  ['ma1', 'performed-in', 'Use', 'Communicative act', '+', 'Austin 1962; Wittgenstein PI §23: use is performed in speech acts'],
  ['ma2', 'describes', 'Sense', 'Intention under a description', '+', 'Anscombe, Intention §§23–26: the description under which the act is intended'],
  ['ma3', 'interprets', 'Sense', 'Reason as cause', '+', 'Davidson, "Radical Interpretation" (1973): meanings and reasons interpreted together'],
  ['ma4', 'instituted-in', 'Sense', 'Communicative act', '+', 'Brandom, Making It Explicit (1994): conceptual content instituted in the practice of giving and asking for reasons'],
  ['ma5', 'configures', 'Significance', 'Imputation', '+', 'Ricoeur, Time and Narrative I; Oneself as Another: narrative configures action and the self it is ascribed to'],
  ['ma6', 'baptizes', 'Communicative act', 'Reference', '+', 'Kripke, Naming and Necessity: reference fixed by an initial baptism'],
  ['ma7', 'moves', 'Reference', 'Deed as beginning', '-', 'Wittgenstein, PI §§611–660; Anscombe: a meaning is not a cause that moves the deed'],
];
module.exports = { ROLE, CORNER, cornerOf, CASTS, G1_MEDIA, G1_TAU, CONVERSE, G1_RELATINGS };

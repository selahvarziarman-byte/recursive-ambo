// written by extract.py from Virgin Land's files (read-only); do not edit by hand
window.DATA = {
 "production": {
  "concept": "Production (the corner's name, given by Arman on 2026-10-19)",
  "subject": "Production: the making of what is used: the form of the thing to be made and the makers' power to make, work done on a material with instruments, the working of many as one producer, the product that outlasts the act, the surplus beyond what replaces what the making used up, and the work of making the makers again; read from Aristotle, NE II.1 and VI.4, Physics I.7, Metaphysics Z.7 and Theta; Smith, Wealth of Nations I.1 and II.3; Hegel, Phenomenology 195 and Philosophy of Right 196-198; Marx, Capital I chs. 6-10, 13-15, 23-24 and the Grundrisse; Quesnay, Tableau (1758); Sraffa, Production of Commodities by Means of Commodities (1960); Arendt, The Human Condition (1958); Georgescu-Roegen 1971; Federici, Caliban and the Witch (2004); Bhattacharya ed., Social Reproduction Theory (2017)",
  "roles": [
   {
    "id": "purpose",
    "label": "the purpose",
    "gloss": "the form of the thing to be made, held before the work: the plan of the house, the recipe, the blueprint; the form in the maker before it is in the matter",
    "types": {
     "lasts beyond the act": "UNKNOWN",
     "used up in the making": "no"
    }
   },
   {
    "id": "capacity",
    "label": "the capacity",
    "gloss": "the makers' power to make, had before it is used: the skill, the labour power, the know-how; a power of contraries, to make or not; a fund, serving making after making (Georgescu-Roegen)",
    "types": {
     "lasts beyond the act": "yes",
     "used up in the making": "in part (spent, and renewed)"
    }
   },
   {
    "id": "material",
    "label": "the material",
    "gloss": "what the work is done on: the ore, the timber, the yarn, the half-made part, the data set; nature as it enters the making, and past product entering again; a flow, gone into the product",
    "types": {
     "lasts beyond the act": "no",
     "used up in the making": "yes"
    }
   },
   {
    "id": "working",
    "label": "the working",
    "gloss": "the activity itself, purposeful and in time: the hand moving, the pump worked, the code written, the field ploughed",
    "types": {
     "lasts beyond the act": "no",
     "used up in the making": "yes"
    }
   },
   {
    "id": "cooperation",
    "label": "the cooperation",
    "gloss": "the working of many as one producer: the pin factory's eighteen operations, the assembly line's crew, the collective worker",
    "types": {
     "lasts beyond the act": "no",
     "used up in the making": "yes"
    }
   },
   {
    "id": "instrument",
    "label": "the instrument",
    "gloss": "what stands between the worker and the material and carries past work into the present one: the tool, the machine, the factory, the road, the earth itself; dead labour put to use; a fund, worn but not used up in one making",
    "types": {
     "lasts beyond the act": "yes",
     "used up in the making": "in part (worn)"
    }
   },
   {
    "id": "product",
    "label": "the product",
    "gloss": "what the making leaves: the thing made, the harvest, the house, the tool; the use-value; labour objectified, at rest",
    "types": {
     "lasts beyond the act": "yes",
     "used up in the making": "no"
    }
   },
   {
    "id": "surplus",
    "label": "the surplus",
    "gloss": "what the making leaves beyond what replaces what it used up: the harvest beyond the seed and the sowers' food, the net product, surplus value in the capitalist form",
    "types": {
     "lasts beyond the act": "yes",
     "used up in the making": "no"
    }
   },
   {
    "id": "reproduction",
    "label": "the reproduction",
    "gloss": "the work of making the makers again: feeding, raising and resting them; much of it the unpaid work of the household",
    "types": {
     "lasts beyond the act": "no",
     "used up in the making": "yes"
    }
   }
  ],
  "ways": [
   {
    "w": "is exercised as",
    "x": "capacity",
    "y": "working",
    "holds": true
   },
   {
    "w": "is exercised as",
    "x": "capacity",
    "y": "reproduction",
    "holds": true
   },
   {
    "w": "is exercised in thought as",
    "x": "capacity",
    "y": "purpose",
    "holds": true
   },
   {
    "w": "is mechanized as",
    "x": "capacity",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "is materialized as",
    "x": "purpose",
    "y": "product",
    "holds": true
   },
   {
    "w": "is worked into",
    "x": "material",
    "y": "product",
    "holds": true
   },
   {
    "w": "is embodied as",
    "x": "working",
    "y": "product",
    "holds": true
   },
   {
    "w": "is embodied as",
    "x": "working",
    "y": "surplus",
    "holds": true
   },
   {
    "w": "is combined as",
    "x": "working",
    "y": "cooperation",
    "holds": true
   },
   {
    "w": "is divided as",
    "x": "working",
    "y": "cooperation",
    "holds": true
   },
   {
    "w": "is practised into",
    "x": "working",
    "y": "capacity",
    "holds": true
   },
   {
    "w": "is mechanized as",
    "x": "working",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "is mechanized as",
    "x": "cooperation",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "is embodied as",
    "x": "cooperation",
    "y": "product",
    "holds": true
   },
   {
    "w": "is embodied as",
    "x": "cooperation",
    "y": "surplus",
    "holds": true
   },
   {
    "w": "is operated as",
    "x": "instrument",
    "y": "working",
    "holds": true
   },
   {
    "w": "is mechanized as",
    "x": "instrument",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "is worked into",
    "x": "instrument",
    "y": "product",
    "holds": false
   },
   {
    "w": "is put to work as",
    "x": "product",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "is put to work as",
    "x": "product",
    "y": "material",
    "holds": true
   },
   {
    "w": "is consumed as",
    "x": "product",
    "y": "capacity",
    "holds": true
   },
   {
    "w": "is put to work as",
    "x": "surplus",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "is put to work as",
    "x": "surplus",
    "y": "material",
    "holds": true
   },
   {
    "w": "is consumed as",
    "x": "surplus",
    "y": "capacity",
    "holds": true
   },
   {
    "w": "is embodied as",
    "x": "reproduction",
    "y": "capacity",
    "holds": true
   }
  ],
  "deps": [
   {
    "w": "requires",
    "x": "working",
    "y": "capacity",
    "holds": true
   },
   {
    "w": "requires",
    "x": "working",
    "y": "material",
    "holds": true
   },
   {
    "w": "requires",
    "x": "working",
    "y": "instrument",
    "holds": true
   },
   {
    "w": "presupposes",
    "x": "working",
    "y": "purpose",
    "holds": true
   },
   {
    "w": "is made of",
    "x": "product",
    "y": "material",
    "holds": true
   },
   {
    "w": "has the form of",
    "x": "product",
    "y": "purpose",
    "holds": true
   },
   {
    "w": "is made by",
    "x": "product",
    "y": "working",
    "holds": true
   },
   {
    "w": "requires",
    "x": "capacity",
    "y": "product",
    "holds": true
   },
   {
    "w": "requires",
    "x": "capacity",
    "y": "reproduction",
    "holds": true
   },
   {
    "w": "is made by",
    "x": "product",
    "y": "capacity",
    "holds": true
   },
   {
    "w": "requires",
    "x": "working",
    "y": "product",
    "holds": true
   },
   {
    "w": "is made of",
    "x": "product",
    "y": "instrument",
    "holds": false
   }
  ],
  "wayWords": [
   "is exercised as",
   "is exercised in thought as",
   "is materialized as",
   "is mechanized as",
   "is worked into",
   "is put to work as",
   "is embodied as",
   "is combined as",
   "is divided as",
   "is practised into",
   "is operated as",
   "is consumed as"
  ],
  "depWords": [
   "requires",
   "presupposes",
   "is made of",
   "has the form of",
   "is made by"
  ],
  "qualities": [
   "lasts beyond the act",
   "used up in the making"
  ],
  "values": 17,
  "axioms": 2
 },
 "distribution": {
  "concept": "Distribution (the corner's name, given by Arman on 2026-10-19)",
  "subject": "Distribution: the apportioning of what is produced, and of the means of producing, among the persons of a society: the produce to be shared, the holding that comes before any sharing, the claims through which a portion is owed, by contract, by entitlement and by gift, the measure by which a portion is right, the portion itself, and the store a center gathers to apportion from; with the ways the apportioning goes, by contract, by entitlement, by gift and its return, by trade, by inheritance, by force, from a center and by deduction; read from Aristotle, NE V.2-5; Hume, Treatise III.i.1 and III.ii.2-5; Smith, Wealth of Nations I.6-11, II.3 and V.2; Ricardo, Principles, preface; Paine, Agrarian Justice (1797); Hegel, Philosophy of Right 214 and 243-245; Marx, Introduction of 1857 section 2, Capital I chs. 7, 24, 26-27 and III chs. 25, 48, 51, Critique of the Gotha Programme (1875); T. H. Marshall, Citizenship and Social Class (1950); Rawls, A Theory of Justice (1971); Nozick, Anarchy, State, and Utopia (1974) ch. 7; Hayek, The Mirage of Social Justice (1976); Walzer, Spheres of Justice (1983); Polanyi, The Economy as Instituted Process (1957); Mauss, The Gift (1925); Sahlins, Stone Age Economics (1972); Piketty, Capital in the Twenty-First Century (2013)",
  "roles": [
   {
    "id": "holding",
    "label": "the holding",
    "gloss": "the means of producing someone holds before any product is shared: the land, the capital, the money, the labour power one has to hire out",
    "types": {
     "of the whole": "no",
     "between parties": "no"
    }
   },
   {
    "id": "produce",
    "label": "the produce",
    "gloss": "what a society's making yields, taken whole, before it is shared: Ricardo's produce of the earth, Marx's total social product, Marshall's national dividend",
    "types": {
     "of the whole": "yes",
     "between parties": "no"
    }
   },
   {
    "id": "claim",
    "label": "the claim",
    "gloss": "a claim to a portion made by contract in an exchange: the lease, the wage contract, the loan's interest, the bill, the bond's coupon; met by payment, and saleable unless the law forbids",
    "types": {
     "of the whole": "no",
     "between parties": "yes"
    }
   },
   {
    "id": "entitlement",
    "label": "the entitlement",
    "gloss": "a claim to a portion held by status, need or desert, under a standard or a membership: the citizen's right to a ration, the pension right, the poor's right to relief, the office by worth; not saleable",
    "types": {
     "of the whole": "no",
     "between parties": "yes"
    }
   },
   {
    "id": "obligation",
    "label": "the obligation",
    "gloss": "the giver's claim to a return for a gift accepted: the counter-gift due, the hospitality owed, the help to be returned; personal, met by a gift in turn (Mauss)",
    "types": {
     "of the whole": "no",
     "between parties": "yes"
    }
   },
   {
    "id": "measure",
    "label": "the measure",
    "gloss": "the standard by which portions are right portions: worth, need, equality, contribution, luck; Aristotle's axia, Rawls's difference principle, 'to each according to his needs'",
    "types": {
     "of the whole": "yes",
     "between parties": "no"
    }
   },
   {
    "id": "share",
    "label": "the share",
    "gloss": "a portion got of what there is: the wage, the rent, the interest, the profit, the dividend, named by their source; the ration, the benefit, the alms, named by their receiver",
    "types": {
     "of the whole": "no",
     "between parties": "no"
    }
   },
   {
    "id": "fund",
    "label": "the fund",
    "gloss": "what a center gathers and holds to apportion: the tax revenue, the tribute, the temple's granary, the common store",
    "types": {
     "of the whole": "yes",
     "between parties": "yes"
    }
   }
  ],
  "ways": [
   {
    "w": "is let out as",
    "x": "holding",
    "y": "claim",
    "holds": true
   },
   {
    "w": "is lent as",
    "x": "holding",
    "y": "claim",
    "holds": true
   },
   {
    "w": "is sold as",
    "x": "holding",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is given as",
    "x": "holding",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is bequeathed as",
    "x": "holding",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is expropriated as",
    "x": "holding",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is pooled as",
    "x": "holding",
    "y": "fund",
    "holds": true
   },
   {
    "w": "is pooled as",
    "x": "produce",
    "y": "fund",
    "holds": true
   },
   {
    "w": "is accumulated as",
    "x": "produce",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is honoured as",
    "x": "claim",
    "y": "share",
    "holds": true
   },
   {
    "w": "is sold as",
    "x": "claim",
    "y": "claim",
    "holds": true
   },
   {
    "w": "is sold as",
    "x": "claim",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is drawn as",
    "x": "entitlement",
    "y": "share",
    "holds": true
   },
   {
    "w": "is drawn as",
    "x": "entitlement",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is sold as",
    "x": "entitlement",
    "y": "entitlement",
    "holds": false
   },
   {
    "w": "is reciprocated as",
    "x": "obligation",
    "y": "share",
    "holds": true
   },
   {
    "w": "is applied as",
    "x": "measure",
    "y": "entitlement",
    "holds": true
   },
   {
    "w": "is accumulated as",
    "x": "share",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is accepted as",
    "x": "share",
    "y": "obligation",
    "holds": true
   },
   {
    "w": "is pooled as",
    "x": "share",
    "y": "fund",
    "holds": true
   },
   {
    "w": "is given as",
    "x": "share",
    "y": "share",
    "holds": true
   },
   {
    "w": "is inferred as",
    "x": "share",
    "y": "measure",
    "holds": false
   },
   {
    "w": "is paid out as",
    "x": "fund",
    "y": "share",
    "holds": true
   },
   {
    "w": "is paid out as",
    "x": "fund",
    "y": "holding",
    "holds": true
   }
  ],
  "deps": [
   {
    "w": "presupposes",
    "x": "entitlement",
    "y": "measure",
    "holds": true
   },
   {
    "w": "is determined by",
    "x": "share",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is bounded by",
    "x": "measure",
    "y": "holding",
    "holds": true
   },
   {
    "w": "is a part of",
    "x": "share",
    "y": "produce",
    "holds": true
   },
   {
    "w": "requires",
    "x": "produce",
    "y": "holding",
    "holds": true
   },
   {
    "w": "falls to the owner of",
    "x": "produce",
    "y": "holding",
    "holds": true
   }
  ],
  "wayWords": [
   "is let out as",
   "is lent as",
   "is sold as",
   "is given as",
   "is bequeathed as",
   "is expropriated as",
   "is pooled as",
   "is honoured as",
   "is applied as",
   "is accumulated as",
   "is accepted as",
   "is reciprocated as",
   "is paid out as",
   "is drawn as",
   "is inferred as"
  ],
  "depWords": [
   "presupposes",
   "is determined by",
   "is a part of",
   "requires",
   "falls to the owner of",
   "is bounded by"
  ],
  "qualities": [
   "between parties",
   "of the whole"
  ],
  "values": 16,
  "axioms": 4
 },
 "relatings": [
  {
   "w": "is put to work as",
   "x": "capacity",
   "y": "holding",
   "holds": true,
   "dir": "←"
  },
  {
   "w": "is put to work as",
   "x": "material",
   "y": "holding",
   "holds": true,
   "dir": "←"
  },
  {
   "w": "is put to work as",
   "x": "instrument",
   "y": "holding",
   "holds": true,
   "dir": "←"
  },
  {
   "w": "is drawn from",
   "x": "instrument",
   "y": "share",
   "holds": false,
   "dir": "←"
  },
  {
   "w": "is drawn from",
   "x": "product",
   "y": "share",
   "holds": true,
   "dir": "←"
  },
  {
   "w": "is drawn from",
   "x": "surplus",
   "y": "share",
   "holds": true,
   "dir": "←"
  },
  {
   "w": "is received as",
   "x": "reproduction",
   "y": "share",
   "holds": true,
   "dir": "→"
  }
 ],
 "source": {
  "casts": {
   "production": "mold-v7_2026-10-20/B_production.cast.json",
   "distribution": "mold-v7_2026-10-20/C_distribution.cast.json"
  },
  "sitting": "2026-10-19_1501_universe_04f1c05_sitting4_P-D_12-relatings-2-bars_all-passages-decided_unnamed.workspace.json"
 }
};

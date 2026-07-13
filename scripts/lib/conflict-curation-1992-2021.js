function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  abkhazia: source(
    "Naciones Unidas: desarrollo de la guerra de Abjasia y ofensivas sobre Sujumi",
    "https://documents.un.org/api/symbol/access?l=en&s=S%2F26795&t=pdf"
  ),
  chechnya: source(
    "US Army Press: operaciones de la primera guerra chechena",
    "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/gott_tanks.pdf"
  ),
  dagestan: source(
    "Human Rights Watch: invasión de Daguestán y operaciones en la zona Kadar",
    "https://www.hrw.org/report/2015/06/18/invisible-war/russias-abusive-response-dagestan-insurgency"
  ),
  macedonia: source(
    "OTAN: enfrentamientos de 2001 en Tetovo y la frontera macedonia",
    "https://www.nato.int/en/news-and-events/events/transcripts/2001/07/24/press-statement-by-the-secretary-general"
  ),
  takurGhar: source(
    "Centro de Historia Militar del Ejército de EE. UU.: Operación Anaconda y Takur Ghar",
    "https://history.army.mil/Portals/143/Images/Publications/Publication%20By%20Title%20Images/P%20Pdf/cmhPub_70-83-1v2.pdf"
  ),
  iraqInvasion: source(
    "US Army Press: invasión de Irak y avance de la coalición hacia Bagdad",
    "https://www.armyupress.army.mil/Films/OIF-The-Drive-to-Baghdad/"
  ),
  nasiriyah: source(
    "Centro de Historia Militar del Ejército de EE. UU.: batalla de Nasiriya de 2003",
    "https://history.army.mil/Portals/143/Images/Publications/ArmyHistoryMag/pdf/20102019/AH76%28W%29.pdf"
  ),
  bridges: source(
    "Ejército Italiano: batalla de los puentes de Nasiriya de 2004",
    "https://www.esercito.difesa.it/comunicazione/il-ricordo-della-battaglia-dei-ponti/92986.html"
  ),
  iraqOccupation: source(
    "Centro de Historia Militar del Ejército de EE. UU.: operaciones de la guerra de Irak",
    "https://history.army.mil/Publications/Publications-Catalog/Tip-of-the-Spear/",
    "media"
  ),
  iraqSurge: source(
    "Centro de Historia Militar del Ejército de EE. UU.: operaciones del refuerzo de tropas de 2007",
    "https://history.army.mil/Publications/Publications-Catalog/The-Surge/"
  ),
  chora: source(
    "Ministerio de Defensa de Países Bajos: batalla de Chora de 2007",
    "https://english.defensie.nl/topics/c/civilian-casualties/investigation-into-suspected-civilian-casualties"
  ),
  syria2013: source(
    "Naciones Unidas: Operación Tormenta del Norte en Alepo durante 2013",
    "https://documents.un.org/doc/undoc/gen/n24/109/81/pdf/n2410981.pdf",
    "media"
  ),
  syria2016: source(
    "Naciones Unidas: situación y ofensivas de Alepo en 2016",
    "https://www.un.org/sg/en/content/former-secretary-general/statements/2016-12-13/secretary-generals-briefing-the-security-council-the-situation-aleppo-syria-delivered"
  ),
  shaddadi: source(
    "Naciones Unidas: ofensiva sobre Al-Shadaddah en 2016",
    "https://documents.un.org/doc/undoc/gen/g16/178/60/pdf/g1617860.pdf"
  ),
  donbas: source(
    "OSCE: hostilidades de 2014 en Karlivka y el este de Ucrania",
    "https://www.osce.org/files/f/documents/b/6/126954.pdf"
  ),
  dikwa: source(
    "Naciones Unidas: operación regional contra Boko Haram en Dikwa en marzo de 2015",
    "https://documents.un.org/api/symbol/access?l=en&s=S%2F2015%2F472&t=pdf"
  ),
  mosul: source(
    "Naciones Unidas: liberación de Mosul en 2017",
    "https://iraq.un.org/en/212479-security-council-press-statement-liberation-mosul"
  ),
  kandahar: source(
    "Naciones Unidas: ofensiva talibán y caída de Kandahar en 2021",
    "https://documents.un.org/doc/undoc/gen/g22/004/41/pdf/g2200441.pdf"
  )
};

function hierarchyFix({
  parent,
  campaign,
  region,
  source: hierarchySource,
  startYear,
  endYear = startYear,
  type = "batalla",
  conflictType = "interestatal",
  scale = "regional"
}) {
  return {
    parent,
    war: parent,
    campaign,
    type,
    conflictType,
    scale,
    status: "historico",
    active: false,
    ongoing: false,
    startYear,
    endYear,
    region,
    normalizedRegion: region,
    related: [...new Set([parent, campaign].filter(Boolean))],
    hierarchyConfidence: hierarchySource.confidence || "alta",
    hierarchySources: [{ label: hierarchySource.label, url: hierarchySource.url }],
    curationPriority: "alta",
    curationBatch: "source-backed-1992-2021-2026-07",
    curationStatus: "estructural",
    dataConfidence: "parcial"
  };
}

function groupFixes(rows, defaults) {
  return Object.fromEntries(rows.map(([
    name,
    campaign,
    region,
    startYear,
    endYear = startYear,
    type = defaults.type || "batalla"
  ]) => [name, hierarchyFix({ ...defaults, campaign, region, startYear, endYear, type })]));
}

export const MODERN_1992_2021_SAFE_CONFLICT_RENAMES = {
  "Ofensiva de enero (guerra de Abjasia)": "Ofensiva de enero de 1993 en Abjasia",
  "Ofensiva de marzo (guerra de Abjasia)": "Ofensiva de marzo de 1993 en Abjasia",
  "Ofensiva de julio (guerra de Abjasia)": "Ofensiva de julio de 1993 en Abjasia",
  "Asalto del palacio presidencial de Grozni": "Asalto al palacio presidencial de Grozni",
  "Batalla de Kerbala de 2003": "Batalla de Karbala de 2003",
  "Batalla de los puentes": "Batalla de los puentes de Nasiriya",
  "Batalla de Al Qaim": "Batalla de Al-Qaim",
  "Batalla de Haifa Street": "Batalla de la calle Haifa",
  "Batalla de Dikwa (2 mar 2015)": "Batalla de Dikwa (2 de marzo de 2015)"
};

const ABKHAZIA_FIXES = groupFixes([
  ["Batalla de Gagra", "Contraofensiva abjasia de octubre de 1992", "Gagra, Abjasia, Georgia", 1992],
  ["Batalla de Sujumi (1992)", "Primera fase de la guerra de Abjasia", "Sujumi, Abjasia, Georgia", 1992],
  ["Sitio de Tkvarcheli", "Cerco de Tkvarcheli", "Tkvarcheli, Abjasia, Georgia", 1992, 1993, "sitio"],
  ["Batalla de Sujumi (1993)", "Ofensivas abjasias sobre Sujumi de 1993", "Sujumi, Abjasia, Georgia", 1993],
  ["Ofensiva de enero de 1993 en Abjasia", "Ofensivas abjasias sobre Sujumi de 1993", "Sujumi, Abjasia, Georgia", 1993, 1993, "ofensiva"],
  ["Ofensiva de marzo de 1993 en Abjasia", "Ofensivas abjasias sobre Sujumi de 1993", "Sujumi, Abjasia, Georgia", 1993, 1993, "ofensiva"],
  ["Ofensiva de julio de 1993 en Abjasia", "Ofensivas abjasias sobre Sujumi de 1993", "Sujumi, Abjasia, Georgia", 1993, 1993, "ofensiva"]
], {
  parent: "Guerra de Abjasia",
  source: SOURCES.abkhazia,
  conflictType: "civil"
});

const CHECHNYA_DAGESTAN_FIXES = {
  ...groupFixes([
    ["Asalto al palacio presidencial de Grozni", "Batalla de Grozni de 1994-1995", "Grozni, Chechenia, Rusia", 1994, 1995, "asalto"],
    ["Batalla de Dolinskoye", "Avance ruso hacia Grozni", "Dolinskoye, Chechenia, Rusia", 1994],
    ["Batalla de Gudermés", "Campaña rusa en el este de Chechenia", "Gudermés, Chechenia, Rusia", 1995]
  ], {
    parent: "Primera guerra chechena",
    source: SOURCES.chechnya,
    conflictType: "independencia"
  }),
  "Batalla de Karamaji": hierarchyFix({
    parent: "Invasión de Daguestán",
    campaign: "Operaciones federales en la zona Kadar",
    region: "Karamaji, Daguestán, Rusia",
    source: SOURCES.dagestan,
    startYear: 1999,
    conflictType: "insurgencia"
  })
};

const MACEDONIA_FIXES = groupFixes([
  ["Batalla de Raduša", "Combates fronterizos de Raduša", "Raduša, Macedonia del Norte", 2001],
  ["Batalla de Tetovo", "Combates de Tetovo de 2001", "Tetovo, Macedonia del Norte", 2001]
], {
  parent: "Conflicto de la República de Macedonia de 2001",
  source: SOURCES.macedonia,
  conflictType: "insurgencia"
});

const AFGHANISTAN_FIXES = {
  "Batalla de Takur Ghar": hierarchyFix({
    parent: "Guerra de Afganistán",
    campaign: "Operación Anaconda",
    region: "Takur Ghar, provincia de Paktia, Afganistán",
    source: SOURCES.takurGhar,
    startYear: 2002,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Chora": hierarchyFix({
    parent: "Guerra de Afganistán",
    campaign: "Operaciones de la ISAF en Uruzgan",
    region: "Chora, provincia de Uruzgan, Afganistán",
    source: SOURCES.chora,
    startYear: 2007,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  "Batalla de Kandahar (2021)": hierarchyFix({
    parent: "Guerra de Afganistán",
    campaign: "Ofensiva talibán de 2021",
    region: "Kandahar, Afganistán",
    source: SOURCES.kandahar,
    startYear: 2021,
    conflictType: "insurgencia",
    scale: "regional"
  })
};

const IRAQ_INVASION_FIXES = groupFixes([
  ["Batalla de Basora", "Invasión de Irak de 2003", "Basora, Irak", 2003],
  ["Batalla de Hilla", "Invasión de Irak de 2003", "Hilla, gobernación de Babilonia, Irak", 2003],
  ["Batalla de Karbala de 2003", "Invasión de Irak de 2003", "Karbala, Irak", 2003],
  ["Batalla de Nasiriya", "Invasión de Irak de 2003", "Nasiriya, gobernación de Dhi Qar, Irak", 2003],
  ["Batalla del paso de Debecka", "Frente norte de la invasión de Irak", "Paso de Debecka, Kurdistán iraquí", 2003]
], {
  parent: "Guerra de Irak",
  source: SOURCES.iraqInvasion,
  conflictType: "interestatal",
  scale: "internacional"
});

IRAQ_INVASION_FIXES["Batalla de Nasiriya"] = {
  ...IRAQ_INVASION_FIXES["Batalla de Nasiriya"],
  hierarchyConfidence: SOURCES.nasiriyah.confidence,
  hierarchySources: [{ label: SOURCES.nasiriyah.label, url: SOURCES.nasiriyah.url }]
};

const IRAQ_OCCUPATION_FIXES = {
  "Batalla de los puentes de Nasiriya": hierarchyFix({
    parent: "Guerra de Irak",
    campaign: "Insurgencia del Ejército del Mahdi de 2004",
    region: "Nasiriya, gobernación de Dhi Qar, Irak",
    source: SOURCES.bridges,
    startYear: 2004,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  ...groupFixes([
    ["Batalla de Mosul (2004)", "Insurgencia iraquí de 2004", "Mosul, gobernación de Nínive, Irak", 2004],
    ["Batalla de Nayaf", "Insurgencia del Ejército del Mahdi de 2004", "Nayaf, Irak", 2004],
    ["Batalla de Samarra", "Operación Baton Rouge", "Samarra, gobernación de Saladino, Irak", 2004],
    ["Primera batalla de Faluya", "Operación Vigilant Resolve", "Faluya, gobernación de Al Anbar, Irak", 2004],
    ["Segunda batalla de Faluya", "Operación Phantom Fury", "Faluya, gobernación de Al Anbar, Irak", 2004],
    ["Batalla de Al-Qaim", "Campaña de Al Anbar de 2005", "Al-Qaim, gobernación de Al Anbar, Irak", 2005],
    ["Batalla de Haditha", "Campaña de Al Anbar de 2005", "Haditha, gobernación de Al Anbar, Irak", 2005],
    ["Batalla de Tal Afar", "Operación Restoring Rights", "Tal Afar, gobernación de Nínive, Irak", 2005]
  ], {
    parent: "Guerra de Irak",
    source: SOURCES.iraqOccupation,
    conflictType: "insurgencia",
    scale: "internacional"
  }),
  ...groupFixes([
    ["Batalla de Baquba", "Operación Arrowhead Ripper", "Baquba, gobernación de Diyala, Irak", 2007],
    ["Batalla de Donkey Island", "Campaña de Diyala de 2007", "isla Donkey, Ramadi, Irak", 2007],
    ["Batalla de la calle Haifa", "Plan de seguridad de Bagdad de 2007", "calle Haifa, Bagdad, Irak", 2007]
  ], {
    parent: "Guerra de Irak",
    source: SOURCES.iraqSurge,
    conflictType: "insurgencia",
    scale: "internacional"
  })
};

const RECENT_CIVIL_WAR_FIXES = {
  "Ofensiva de Alepo de 2013": hierarchyFix({
    parent: "Guerra civil siria",
    campaign: "Operación Tormenta del Norte",
    region: "gobernación de Alepo, Siria",
    source: SOURCES.syria2013,
    startYear: 2013,
    type: "ofensiva",
    conflictType: "civil"
  }),
  "Batalla de Karlivka": hierarchyFix({
    parent: "Guerra del Donbás",
    campaign: "Primera campaña del Donbás de 2014",
    region: "Karlivka, óblast de Donetsk, Ucrania",
    source: SOURCES.donbas,
    startYear: 2014,
    conflictType: "civil"
  }),
  "Batalla de Dikwa (2 de marzo de 2015)": hierarchyFix({
    parent: "Insurgencia de Boko Haram",
    campaign: "Ofensiva regional contra Boko Haram de 2015",
    region: "Dikwa, estado de Borno, Nigeria",
    source: SOURCES.dikwa,
    startYear: 2015,
    conflictType: "insurgencia"
  }),
  "Ofensiva de Al-Shadaddah": hierarchyFix({
    parent: "Guerra civil siria",
    campaign: "Campaña contra Estado Islámico en Hasaka",
    region: "Al-Shadaddah, gobernación de Hasaka, Siria",
    source: SOURCES.shaddadi,
    startYear: 2016,
    type: "ofensiva",
    conflictType: "civil",
    scale: "internacional"
  }),
  "Ofensiva de Alepo de abril de 2016": hierarchyFix({
    parent: "Guerra civil siria",
    campaign: "Ofensivas de Alepo de 2016",
    region: "gobernación de Alepo, Siria",
    source: SOURCES.syria2016,
    startYear: 2016,
    type: "ofensiva",
    conflictType: "civil",
    scale: "internacional"
  }),
  "Batalla de Mosul (2016-2017)": hierarchyFix({
    parent: "Guerra contra el Estado Islámico",
    campaign: "Ofensiva de Mosul (2016-2017)",
    region: "Mosul, gobernación de Nínive, Irak",
    source: SOURCES.mosul,
    startYear: 2016,
    endYear: 2017,
    conflictType: "insurgencia",
    scale: "internacional"
  })
};

export const MODERN_1992_2021_CONFLICT_DETAIL_FIXES = {
  ...ABKHAZIA_FIXES,
  ...CHECHNYA_DAGESTAN_FIXES,
  ...MACEDONIA_FIXES,
  ...AFGHANISTAN_FIXES,
  ...IRAQ_INVASION_FIXES,
  ...IRAQ_OCCUPATION_FIXES,
  ...RECENT_CIVIL_WAR_FIXES
};

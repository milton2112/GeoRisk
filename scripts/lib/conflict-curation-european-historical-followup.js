function source(label, url, confidence = "alta") {
  return { label, url, confidence };
}

const SOURCES = {
  sejnyPolishMilitaryAcademy: source(
    "Akademia Militar de Polonia: estudio de los combates polaco-lituanos en Suwalszczyzna durante septiembre de 1920",
    "https://pbio.akademia.mil.pl/wyzsza-szkola-wojenna-2/walki-polsko-litewskie-na-suwalszczyznie-we-wrzesniu-1920-r-opracwal-jozef-smolenski/"
  ),
  sejnyInstituteOfNationalRemembrance: source(
    "Instituto de la Memoria Nacional de Polonia: ofensiva del grupo norte sobre Sejny durante la batalla del Niemen de 1920",
    "https://walkaogranice.ipn.gov.pl/bitwa-niemenska.html"
  ),
  swiecinoPolishEducation: source(
    "Plataforma Educativa de Polonia: batalla de Swiecino del 17 de septiembre de 1462 y su resultado",
    "https://zpe.gov.pl/watek/LP190LTbYE/54/a/wojna-trzynastoletnia-i-jej-skutki/Db7K1t8RK"
  ),
  swiecinoPolishEducationTimeline: source(
    "Plataforma Educativa de Polonia: cronologia de la Guerra de los Trece Anos y Segundo Tratado de Torun",
    "https://zpe.gov.pl/a/wojna-trzynastoletnia-polski-z-zakonem-krzyzackim/DVhXDJsl3"
  ),
  vlothoWestphalianHistory: source(
    "Historia de Westfalia (LWL): batalla de Valdorf/Vlotho del 17 de octubre de 1638, derrota palatina y captura de Rupert",
    "https://www.lwl.org/westfaelische-geschichte/portal/Internet/finde/langDatensatz.php?urlID=1517&url_tabelle=tab_person"
  ),
  vlothoUniversityOfMunster: source(
    "Universidad de Munster: registro historico de la batalla de Vlotho o Valdorf del 17 de octubre de 1638",
    "https://sammlungen.ulb.uni-muenster.de/hd/periodical/structure/3884725"
  ),
  zawichostScriptaHistorica: source(
    "Scripta Historica: relaciones polaco-rutenas y muerte de Roman de Galitzia-Volinia en Zawichost en 1205",
    "https://ssh.upsl.edu.pl/images/NR24/01.pdf"
  ),
  zawichostGaliciaJournal: source(
    "Revista academica Galichina: fuentes sobre Roman Mstislavich y la batalla de Zawichost del 19 de junio de 1205",
    "https://journals.pnu.edu.ua/index.php/istgal/article/view/10597"
  )
};

function historicalFix({
  parent,
  campaign,
  region,
  hierarchySources,
  startYear,
  participants,
  cause,
  outcome,
  consequences,
  chronology,
  type = "batalla",
  conflictType = "interestatal",
  scale = "regional",
  treaties = [],
  related = [],
  curationNote,
  sourceDispute = false
}) {
  const sources = Array.isArray(hierarchySources) ? hierarchySources : [hierarchySources];
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
    endYear: startYear,
    region,
    normalizedRegion: region,
    cause,
    outcome,
    consequences,
    chronology,
    treaties,
    related: [...new Set([parent, campaign, ...related].filter(Boolean))],
    participants,
    hierarchyConfidence: "alta",
    hierarchySources: sources.map(item => ({ label: item.label, url: item.url })),
    curationPriority: "alta",
    curationBatch: "source-backed-european-historical-followup-2026-08",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote,
    ...(sourceDispute ? { sourceDispute: true } : {})
  };
}

export const EUROPEAN_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES = {
  "Batalla de Sejny": "Batalla de Sejny (1920)",
  "Batalla de \u015awiecino": "Batalla de \u015awiecino (1462)",
  "Batalla de Vlotho": "Batalla de Vlotho (1638)",
  "Batalla de Zawichost": "Batalla de Zawichost (1205)"
};

export const EUROPEAN_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS = {
  Polonia: ["Batalla de Sejny (1920)"],
  Alemania: ["Batalla de Vlotho (1638)"]
};

export const EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES = {
  "Batalla de Sejny (1920)": historicalFix({
    parent: "Guerra polaco-lituana (1919-1920)",
    campaign: "Operaci\u00f3n Sejny-August\u00f3w (septiembre de 1920)",
    region: "Regi\u00f3n de Suwalszczyzna, con combates en Sejny, Suwa\u0142ki y August\u00f3w; actual noreste de Polonia",
    hierarchySources: [SOURCES.sejnyPolishMilitaryAcademy, SOURCES.sejnyInstituteOfNationalRemembrance],
    startYear: 1920,
    type: "batalla terrestre",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      { side: "Fuerzas de la Segunda Republica Polaca", members: ["Ejercito Polaco"] },
      { side: "Fuerzas de la Republica de Lituania", members: ["Ejercito de Lituania"] }
    ],
    cause: "Tras la ofensiva polaca posterior a la batalla de Varsovia, fuerzas polacas y lituanas disputaron el control de la region de Suwalszczyzna y de los accesos operacionales hacia el Niemen.",
    outcome: "Las fuerzas polacas se impusieron en los combates de septiembre y recuperaron Sejny; la accion no resolvio por si sola la disputa fronteriza entre ambos Estados.",
    consequences: "La operacion modifico la situacion militar en la frontera durante 1920 y se vinculo al marco de la batalla del Niemen y a la negociacion posterior del Acuerdo de Suwalki.",
    chronology: [
      { year: 1920, event: "Entre el 2 y el 10 de septiembre, los combates por Sejny, Suwa\u0142ki y August\u00f3w reabrieron el frente polaco-lituano." },
      { year: 1920, event: "El 22 de septiembre, el avance polaco recupero Sejny dentro de la operacion sobre el ala norte de la batalla del Niemen." }
    ],
    treaties: ["Acuerdo de Suwalki (1920)"],
    curationNote: "La ficha distingue la batalla de 1920 de la insurreccion de Sejny de 1919, que es un episodio diferente. Mantiene a Polonia y Lituania como Estados de epoca y no usa el resultado tactico para presentar la delimitacion territorial como una solucion juridica definitiva.",
    sourceDispute: true
  }),
  "Batalla de \u015awiecino (1462)": historicalFix({
    parent: "Guerra de los Trece A\u00f1os polaco-teut\u00f3nica (1454-1466)",
    campaign: "Operaciones por Pomerelia y el lago \u017barnowieckie (1462)",
    region: "\u015awiecino, cerca del lago \u017barnowieckie, Pomerelia; actual norte de Polonia",
    hierarchySources: [SOURCES.swiecinoPolishEducation, SOURCES.swiecinoPolishEducationTimeline],
    startYear: 1462,
    type: "batalla terrestre",
    conflictType: "interestatal",
    scale: "regional",
    participants: [
      {
        side: "Fuerzas de la Corona del Reino de Polonia y la Confederacion Prusiana",
        members: ["Corona del Reino de Polonia", "Confederacion Prusiana"]
      },
      {
        side: "Fuerzas mercenarias del Estado monastico de la Orden Teutonica",
        members: ["Estado monastico de la Orden Teutonica"]
      }
    ],
    cause: "La campana por Pomerelia enfrento a la Corona polaca y sus aliados prusianos con las fuerzas de la Orden Teutonica durante la Guerra de los Trece Anos.",
    outcome: "Las fuerzas polacas dirigidas por Piotr Dunin derrotaron a las tropas mercenarias teutonicas el 17 de septiembre de 1462; la victoria no decidio por si sola la guerra.",
    consequences: "El resultado tuvo impacto propagandistico en la guerra y se integro en la secuencia que concluyo con el Segundo Tratado de Torun de 1466, sin atribuir a esta accion un desenlace estrategico unico.",
    chronology: [
      { year: 1462, event: "Durante 1462, las operaciones por Pomerelia buscaron controlar el entorno del lago \u017barnowieckie." },
      { year: 1462, event: "El 17 de septiembre, las fuerzas de Piotr Dunin vencieron a las tropas mercenarias teutonicas en \u015awiecino." }
    ],
    treaties: ["Segundo Tratado de Torun (1466)"],
    curationNote: "La Orden Teutonica se conserva como actor historico propio y no se sustituye por Alemania contemporanea. La ficha refleja que la fuente atribuye una victoria polaca con importancia propagandistica, sin convertirla en un supuesto punto de inflexion unico de la guerra."
  }),
  "Batalla de Vlotho (1638)": historicalFix({
    parent: "Guerra de los Treinta A\u00f1os",
    campaign: "Expedici\u00f3n palatina de Carlos Luis en Westfalia (1638)",
    region: "Valdorf/Vlotho, en Westfalia; actual Renania del Norte-Westfalia, Alemania",
    hierarchySources: [SOURCES.vlothoWestphalianHistory, SOURCES.vlothoUniversityOfMunster],
    startYear: 1638,
    type: "batalla terrestre",
    conflictType: "interestatal",
    scale: "internacional",
    participants: [
      { side: "Ejercito palatino de Carlos Luis", members: ["Electorado del Palatinado"] },
      { side: "Ejercito imperial de Melchior von Hatzfeldt", members: ["Sacro Imperio Romano Germanico"] }
    ],
    cause: "Carlos Luis intento recuperar una posicion palatina en Westfalia durante la Guerra de los Treinta Anos, mientras las fuerzas imperiales de Hatzfeldt organizaron la respuesta.",
    outcome: "El 17 de octubre de 1638, las fuerzas imperiales derrotaron al ejercito palatino en Valdorf/Vlotho; Carlos Luis escapo y el principe Rupert fue capturado.",
    consequences: "La derrota frustro la expedicion palatina de 1638 y mantuvo la cuestion del Palatinado dentro de la guerra hasta el arreglo general de Westfalia.",
    chronology: [
      { year: 1638, event: "En octubre, la expedicion palatina avanzo por Westfalia antes de que Hatzfeldt reuniera fuerzas imperiales." },
      { year: 1638, event: "El 17 de octubre, el ejercito imperial derroto a Carlos Luis en la batalla conocida como Vlotho o Valdorf." }
    ],
    treaties: ["Paz de Westfalia (1648)"],
    curationNote: "Valdorf y Vlotho se conservan como variantes historicas del lugar. Alemania se vincula solo como referencia geografica actual; el Reino Unido permanece como referencia de navegacion heredada por Rupert y no se presenta como un Estado beligerante contemporaneo de 1638.",
    sourceDispute: true
  }),
  "Batalla de Zawichost (1205)": historicalFix({
    parent: "Conflicto polaco-ruteno de 1205",
    campaign: "Incursi\u00f3n de Roman de Galitzia-Volinia en la Peque\u00f1a Polonia (1205)",
    region: "Zawichost, valle del V\u00edstula, Peque\u00f1a Polonia de la epoca; actual Polonia",
    hierarchySources: [SOURCES.zawichostScriptaHistorica, SOURCES.zawichostGaliciaJournal],
    startYear: 1205,
    type: "batalla terrestre",
    conflictType: "frontera",
    scale: "regional",
    participants: [
      {
        side: "Fuerzas de Leszek I el Blanco y Conrado de Mazovia",
        members: ["Principado de Cracovia", "Ducado de Mazovia"]
      },
      {
        side: "Fuerzas de Roman Mstislavich",
        members: ["Principado de Galitzia-Volinia"]
      }
    ],
    cause: "Roman de Galitzia-Volinia emprendio una incursi\u00f3n hacia la Peque\u00f1a Polonia, donde fue enfrentado por las fuerzas de los principes polacos.",
    outcome: "Las fuerzas de Roman fueron derrotadas en Zawichost y Roman murio durante el combate; la ficha no fija bajas para las que las fuentes sinteticas no dan un consenso utilizable.",
    consequences: "La batalla puso fin a la incursi\u00f3n de 1205. Sus efectos sucesorios y politicos posteriores se mantienen separados de la accion tactica para no presentar una cadena historica discutida como un resultado militar cerrado.",
    chronology: [
      { year: 1205, event: "Roman de Galitzia-Volinia entro en conflicto con los principes polacos en la Peque\u00f1a Polonia." },
      { year: 1205, event: "El 19 de junio, las fuerzas de Leszek y Conrado derrotaron a Roman en Zawichost; Roman murio en el enfrentamiento." }
    ],
    treaties: [],
    curationNote: "La etiqueta polaco-ruteno describe a los actores de epoca y no equipara el Principado de Galitzia-Volinia con un Estado contemporaneo. La localizacion y la secuencia del combate tienen tradiciones historiograficas distintas, por lo que se conservan participantes, fecha y resultado basicos sin inventar bajas ni un tratado de cierre.",
    sourceDispute: true
  })
};
